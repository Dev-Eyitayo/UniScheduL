from io import BytesIO
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.pagesizes import letter, landscape
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
import docx
from django.http import FileResponse
from reportlab.lib.units import inch

DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
HOURS = ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00"]

def generate_pdf(schedule, failed, semester, year, dept, faculty, session):
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=landscape(letter))
    styles = getSampleStyleSheet()
    story = []

    title = Paragraph(f"<b>{dept}, {faculty} - {semester} ({year})<br/>{session}</b>", styles["Title"])
    story.append(title)
    story.append(Spacer(1, 12))

    table_data = [["Days"] + HOURS]
    for day in DAYS:
        row = [day]
        for hour in HOURS:
            booked = [
                f"{b['course_id']} - {b['course_name']}\n{b['lecturer']}\nRoom: {b['room']}"
                for b in schedule if b['day'] == day and hour >= b['start_time'] and hour < b['end_time']
            ]
            row.append("\n\n".join(booked) if booked else "")
        table_data.append(row)

    # Define fixed column widths: first column for days, then equally sized time slots
    col_widths = [1.0 * inch] + [0.85 * inch] * len(HOURS)

    tbl = Table(table_data, repeatRows=1, colWidths=col_widths)
    tbl.setStyle(TableStyle([
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('BACKGROUND', (0, 0), (-1, 0), colors.gray),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        # ('FONTSIZE', (0, 0), (-1, 0), 11),
        ('BACKGROUND', (0, 1), (0, -1), colors.lightgrey),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('FONTSIZE', (0, 1), (-1, -1), 6),
        ('FONTSIZE', (0, 1), (-1, -1), 5.5),
        ('LEADING', (0, 1), (-1, -1), 6),  # helps line spacing
    ]))
    story.append(tbl)

    if failed:
        story.append(Spacer(1, 12))
        story.append(Paragraph("Failed Scheduling Attempts:", styles["Heading2"]))
        for f in failed:
            story.append(Paragraph(f"❌ {f}", styles["Normal"]))

    doc.build(story)
    buffer.seek(0)
    return FileResponse(buffer, as_attachment=True, filename="Optimized_Schedule.pdf")

def generate_docx(schedule, failed, semester, year, dept, faculty, session):
    doc = docx.Document()
    doc.add_heading(f"{dept}, {faculty} - {semester} ({year}) / {session}", 0)

    table = doc.add_table(rows=len(DAYS)+1, cols=len(HOURS)+1)
    table.style = 'Table Grid'

    table.rows[0].cells[0].text = "Days"
    for i, hour in enumerate(HOURS):
        table.rows[0].cells[i+1].text = hour

    for r, day in enumerate(DAYS, start=1):
        table.cell(r, 0).text = day
        for c, hour in enumerate(HOURS, start=1):
            found = [
                f"{b['course_id']} - {b['course_name']}\n{b['lecturer']}\nRoom: {b['room']}"
                for b in schedule if b['day'] == day and hour >= b['start_time'] and hour < b['end_time']
            ]
            table.cell(r, c).text = "\n\n".join(found)

    if failed:
        doc.add_heading("Failed Scheduling Attempts:", level=2)
        for f in failed:
            doc.add_paragraph(f"❌ {f}", style='List Bullet')

    buffer = BytesIO()
    doc.save(buffer)
    buffer.seek(0)
    return FileResponse(buffer, as_attachment=True, filename="Optimized_Schedule.docx")
