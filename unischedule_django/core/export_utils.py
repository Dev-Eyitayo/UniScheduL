import docx
from io import BytesIO
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.pagesizes import letter, landscape
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet
from django.http import FileResponse

DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
HOURS = ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00"]

from reportlab.lib.styles import ParagraphStyle

def generate_pdf(schedule, failed, semester, year, dept, faculty, session):
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=landscape(letter),
                            leftMargin=30, rightMargin=30, topMargin=30, bottomMargin=30)
    styles = getSampleStyleSheet()
    
    # Use smaller body style for better wrapping
    small_style = ParagraphStyle(
        name='SmallCell',
        fontSize=5.5,
        leading=6,
        spaceAfter=0,
    )

    story = []

    title = Paragraph(f"<b>{dept}, {faculty} - {semester} ({year})<br/>{session}</b>", styles["Title"])
    story.append(title)
    story.append(Spacer(1, 12))

    # Table header
    table_data = [["Days"] + HOURS]

    # Table body rows
    for day in DAYS:
        row = [Paragraph(day, small_style)]
        for hour in HOURS:
            booked = [
                Paragraph(
                    f"<b>{b['course_id']}</b><br/>{b['lecturer']}<br/><i>Room: {b['room']}</i>\n",
                    small_style
                )
                for b in schedule if b['day'] == day and hour >= b['start_time'] and hour < b['end_time']
            ]
            row.append(booked if booked else "")
        table_data.append(row)

    # Adjust column widths to squeeze 11 columns to one page
    col_widths = [0.9 * inch] + [0.82 * inch] * len(HOURS)

    tbl = Table(table_data, repeatRows=1, colWidths=col_widths)
    tbl.setStyle(TableStyle([
        ('GRID', (0, 0), (-1, -1), 0.5, colors.black),
        ('BACKGROUND', (0, 0), (-1, 0), colors.darkgray),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 2),
        ('RIGHTPADDING', (0, 0), (-1, -1), 2),
        ('TOPPADDING', (0, 0), (-1, -1), 2),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
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
