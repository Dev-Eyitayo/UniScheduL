// import React, { useState } from "react";
// import axios from "axios";

// const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
// const HOURS = ["08:00","09:00","10:00","11:00","12:00",
//               "13:00","14:00","15:00","16:00","17:00"];

// // Predefine faculties & sessions
// const FACULTIES = ["Science", "Engineering", "Arts", "Social Sciences", "Education"];
// const SESSIONS = ["2024/2025", "2025/2026", "2026/2027", "2027/2028"];

// export default function OptimizedSchedule() {
//   const [logs, setLogs] = useState([]);
//   const [schedule, setSchedule] = useState([]);
//   const [failedBookings, setFailedBookings] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Dropdown: user picks a faculty & academic session
//   const [faculty, setFaculty] = useState("");          // or default to "Science"
//   const [academicSession, setAcademicSession] = useState("");  // or default to "2024/2025"

//   // For exporting PDF or DOCX
//   const [showExportDropdown, setShowExportDropdown] = useState(false);

//   // 1) Run scheduling algorithm
//   const runAlgorithm = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch("http://127.0.0.1:8000/api/run-algorithm");
//       if (!res.ok) throw new Error("Failed to run the algorithm");

//       const data = await res.json();
//       setLogs(data.logs);
//       setSchedule(data.bookings);
//       setFailedBookings(data.failed_bookings);
//     } catch (error) {
//       console.error("Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 2) Clear logs
//   const clearLogs = () => {
//     setLogs([]);
//     setSchedule([]);
//     setFailedBookings([]);
//   };

//   // 3) Generate file with chosen format
//   const generateFile = async (format) => {
//     try {
//       const response = await axios.post(
//         "http://127.0.0.1:5000/api/export-file",
//         {
//           format,
//           // existing data
//           semester: "Fall 2025",
//           academic_year: "2025/2026",
//           department: "Physics",
//           schedule,
//           failed_bookings: failedBookings,
//           // new fields from the dropdowns
//           faculty,
//           session: academicSession,
//         },
//         { responseType: "blob" }
//       );

//       let fileType =
//         format === "pdf"
//           ? "application/pdf"
//           : "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
//       let fileName =
//         format === "pdf"
//           ? "Optimized_Schedule.pdf"
//           : "Optimized_Schedule.docx";

//       const blob = new Blob([response.data], { type: fileType });
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = fileName;
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//     } catch (error) {
//       console.error("Error generating file:", error);
//     } finally {
//       setShowExportDropdown(false);
//     }
//   };

//   // Helper: check if an hour is within [start, end)
//   const isWithinTimeSlot = (hour, start, end) => {
//     const hourNum = parseInt(hour.split(":")[0], 10);
//     const startNum = parseInt(start.split(":")[0], 10);
//     const endNum   = parseInt(end.split(":")[0], 10);
//     return hourNum >= startNum && hourNum < endNum;
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4">📅 Optimized Timetable</h2>

//       {/* Faculty & Session Fields */}
//       <div className="mb-4 flex gap-6 items-center">
//         <div>
//           <label className="block font-semibold mb-1">Select Faculty:</label>
//           <select
//             className="border p-2 rounded"
//             value={faculty}
//             onChange={(e) => setFaculty(e.target.value)}
//           >
//             <option value="">-- Choose a Faculty --</option>
//             {FACULTIES.map((fac) => (
//               <option key={fac} value={fac}>{fac}</option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block font-semibold mb-1">Academic Session:</label>
//           <select
//             className="border p-2 rounded"
//             value={academicSession}
//             onChange={(e) => setAcademicSession(e.target.value)}
//           >
//             <option value="">-- Choose Session --</option>
//             {SESSIONS.map((ses) => (
//               <option key={ses} value={ses}>{ses}</option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* Buttons */}
//       <div className="mb-4">
//         <button
//           className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2"
//           onClick={runAlgorithm}
//           disabled={loading}
//         >
//           {loading ? "Running Algorithm..." : "Run Algorithm"}
//         </button>

//         {logs.length > 0 && (
//           <>
//             <button
//               className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mr-2"
//               onClick={clearLogs}
//             >
//               Clear Logs 🗑️
//             </button>

//             <div className="relative inline-block">
//               <button
//                 onClick={() => setShowExportDropdown(!showExportDropdown)}
//                 className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
//               >
//                 Export ▼
//               </button>
//               {showExportDropdown && (
//                 <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded">
//                   <button
//                     onClick={() => generateFile("pdf")}
//                     className="block w-full text-left px-4 py-2 hover:bg-gray-200"
//                   >
//                     Download as PDF
//                   </button>
//                   <button
//                     onClick={() => generateFile("docx")}
//                     className="block w-full text-left px-4 py-2 hover:bg-gray-200"
//                   >
//                     Download as DOCX
//                   </button>
//                 </div>
//               )}
//             </div>
//           </>
//         )}
//       </div>

//       {/* Logs Section */}
//       {logs.length > 0 && (
//         <div className="mt-6 bg-gray-100 p-4 rounded">
//           <h3 className="text-lg font-semibold mb-2">📝 Algorithm Logs:</h3>
//           <ul className="list-disc list-inside">
//             {logs.map((log, index) => {
//               const isWarning = log.startsWith("⚠️");
//               const isError = log.startsWith("❌");
//               return (
//                 <li
//                   key={index}
//                   className={
//                     isWarning ? "text-yellow-600"
//                     : isError ? "text-red-600"
//                     : "text-gray-700"
//                   }
//                 >
//                   {log}
//                 </li>
//               );
//             })}
//           </ul>
//         </div>
//       )}

//       {/* Timetable */}
//       {schedule.length > 0 && (
//         <div className="mt-6">
//           <h3 className="text-lg font-semibold mb-2">📅 Final Room Schedule (Optimized)</h3>
//           <div className="overflow-x-auto w-full">
//             <table className="w-max border border-collapse">
//               <thead>
//                 <tr className="bg-gray-200">
//                   <th className="border px-4 py-2">Days</th>
//                   {HOURS.map((hour) => (
//                     <th key={hour} className="border px-4 py-2 min-w-[80px]">
//                       {hour}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {DAYS.map((day) => (
//                   <tr key={day}>
//                     <td className="border px-4 py-2 font-bold">{day}</td>
//                     {HOURS.map((hour) => {
//                       const activeBookings = schedule.filter((bk) =>
//                         bk.day === day &&
//                         isWithinTimeSlot(hour, bk.start_time, bk.end_time)
//                       );
//                       return (
//                         <td
//                           key={hour}
//                           className="border px-4 py-2 text-center align-top"
//                         >
//                           {activeBookings.length === 0 ? (
//                             <span>—</span>
//                           ) : (
//                             activeBookings.map((bk, idx) => (
//                               <div
//                                 key={idx}
//                                 className="bg-blue-100 p-1 mb-2 rounded"
//                               >
//                                 <div className="font-bold">
//                                   {bk.course_id} - {bk.course_name}
//                                 </div>
//                                 <div className="text-sm italic">
//                                   {bk.lecturer}
//                                 </div>
//                                 <div className="text-xs">
//                                   Room: {bk.room}
//                                 </div>
//                               </div>
//                             ))
//                           )}
//                         </td>
//                       );
//                     })}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* Failed Bookings Section */}
//       {failedBookings.length > 0 && (
//         <div className="mt-6 bg-red-100 p-4 rounded">
//           <h3 className="text-lg font-semibold text-red-700 mb-2">
//             🚨 Failed Scheduling Attempts:
//           </h3>
//           <ul className="list-disc list-inside">
//             {failedBookings.map((failure, index) => (
//               <li key={index} className="text-red-700">
//                 ❌ {failure}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }





// -------------------------------------------------   EYITAYO ----------------------------------------------------



import React, { useState } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners"; // Import spinner
import infinityGif from '../../assets/infinity.gif';
import authFetch from "../../utils/authFetch";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const HOURS = ["08:00","09:00","10:00","11:00","12:00",
              "13:00","14:00","15:00","16:00","17:00"];

// Predefine faculties & sessions
const FACULTIES = ["Natural and Applied Science", "Engineering", "Arts", "Education"];
const SESSIONS = ["2024/2025", "2025/2026", "2026/2027", "2027/2028", "2028/2029"];

export default function OptimizedSchedule() {
  const [logs, setLogs] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [failedBookings, setFailedBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  // Dropdown: user picks a faculty & academic session
  const [faculty, setFaculty] = useState("");          // or default to "Science"
  const [academicSession, setAcademicSession] = useState("");  // or default to "2024/2025"

  // For exporting PDF or DOCX
  const [showExportDropdown, setShowExportDropdown] = useState(false);

  // 1) Run scheduling algorithm
  // const runAlgorithm = async () => {
  //   setLoading(true);
  //   try {
  //     const res = await fetch("http://127.0.0.1:8000/api/run-algorithm");
  //     if (!res.ok) throw new Error("Failed to run the algorithm");

  //     const data = await res.json();
  //     setLogs(data.logs);
  //     setSchedule(data.bookings);
  //     setFailedBookings(data.failed_bookings);
  //   } catch (error) {
  //     console.error("Error:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const runAlgorithm = async () => {
    setLoading(true);
    const startTime = Date.now(); // Record the start time
  
    try {
      const data = await authFetch("http://127.0.0.1:8000/api/run-algorithm");
  
      // Ensure at least 15 seconds before updating the state
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 2000 - elapsedTime); // Ensure it's not negative
  
      setTimeout(() => {
        setLogs(data.logs);
        setSchedule(data.bookings);
        setFailedBookings(data.failed_bookings);
        setLoading(false);
      }, remainingTime);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };
  

  // 2) Clear logs
  const clearLogs = () => {
    setLogs([]);
    setSchedule([]);
    setFailedBookings([]);
  };

  // 3) Generate file with chosen format
  const generateFile = async (format) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/export-file",
        {
          format,
          // existing data
          semester: "Fall 2025",
          academic_year: "2025/2026",
          department: "Physics",
          schedule,
          failed_bookings: failedBookings,
          // new fields from the dropdowns
          faculty,
          session: academicSession,
        },
        { responseType: "blob" }
      );

      let fileType =
        format === "pdf"
          ? "application/pdf"
          : "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      let fileName =
        format === "pdf"
          ? "Optimized_Schedule.pdf"
          : "Optimized_Schedule.docx";

      const blob = new Blob([response.data], { type: fileType });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error generating file:", error);
    } finally {
      setShowExportDropdown(false);
    }
  };

  // Helper: check if an hour is within [start, end)
  const isWithinTimeSlot = (hour, start, end) => {
    const hourNum = parseInt(hour.split(":")[0], 10);
    const startNum = parseInt(start.split(":")[0], 10);
    const endNum   = parseInt(end.split(":")[0], 10);
    return hourNum >= startNum && hourNum < endNum;
  };

return (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-4">📅 Optimized Timetable</h2>

    {/* Faculty & Session Fields */}
    <div className="mb-4 flex gap-6 items-center">
      <div>
        <label className="block font-semibold mb-1">Select Faculty:</label>
        <select
          className="border p-2 rounded"
          value={faculty}
          onChange={(e) => setFaculty(e.target.value)}
        >
          <option value="">-- Choose a Faculty --</option>
          {FACULTIES.map((fac) => (
            <option key={fac} value={fac}>{fac}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-semibold mb-1">Academic Session:</label>
        <select
          className="border p-2 rounded"
          value={academicSession}
          onChange={(e) => setAcademicSession(e.target.value)}
        >
          <option value="">-- Choose Session --</option>
          {SESSIONS.map((ses) => (
            <option key={ses} value={ses}>{ses}</option>
          ))}
        </select>
      </div>
    </div>

    {/* Buttons */}
    <div className="mb-4">
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2"
        onClick={runAlgorithm}
        disabled={loading}
      >
        {loading ? "Running Algorithm..." : "Run Algorithm"}
      </button>

      {logs.length > 0 && !loading && (
        <>
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mr-2"
            onClick={clearLogs}
          >
            Clear Logs 🗑️
          </button>

          <div className="relative inline-block">
            <button
              onClick={() => setShowExportDropdown(!showExportDropdown)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              Export ▼
            </button>
            {showExportDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded">
                <button
                  onClick={() => generateFile("pdf")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                >
                  Download as PDF
                </button>
                <button
                  onClick={() => generateFile("docx")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                >
                  Download as DOCX
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>

    {/* Loading Animation */}
    {loading && (
      <div className="flex justify-center items-center mt-20">
          <img src={infinityGif} alt="Loading..." className="w-40 h-40" />
      </div>
    )}

    {/* Display the timetable & logs only when not loading */}
    {!loading && logs.length > 0 && (
      <div>
        {/* Logs Section */}
        <div className="mt-6 bg-gray-100 p-4 rounded">
          <h3 className="text-lg font-semibold mb-2">📝 Algorithm Logs:</h3>
          <ul className="list-disc list-inside">
            {logs.map((log, index) => {
              const isWarning = log.startsWith("⚠️");
              const isError = log.startsWith("❌");
              return (
                <li
                  key={index}
                  className={
                    isWarning ? "text-yellow-600"
                    : isError ? "text-red-600"
                    : "text-gray-700"
                  }
                >
                  {log}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Timetable */}
        {schedule.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">📅 Final Room Schedule (Optimized)</h3>
            <div className="overflow-x-auto w-full">
              <table className="w-max border border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border px-4 py-2">Days</th>
                    {HOURS.map((hour) => (
                      <th key={hour} className="border px-4 py-2 min-w-[80px]">
                        {hour}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DAYS.map((day) => (
                    <tr key={day}>
                      <td className="border px-4 py-2 font-bold">{day}</td>
                      {HOURS.map((hour) => {
                        const activeBookings = schedule.filter((bk) =>
                          bk.day === day &&
                          isWithinTimeSlot(hour, bk.start_time, bk.end_time)
                        );
                        return (
                          <td
                            key={hour}
                            className="border px-4 py-2 text-center align-top"
                          >
                            {activeBookings.length === 0 ? (
                              <span>—</span>
                            ) : (
                              activeBookings.map((bk, idx) => (
                                <div
                                  key={idx}
                                  className="bg-blue-100 p-1 mb-2 rounded"
                                >
                                  <div className="font-bold">
                                    {bk.course_id} - {bk.course_name}
                                  </div>
                                  <div className="text-sm italic">
                                    {bk.lecturer}
                                  </div>
                                  <div className="text-xs">
                                    Room: {bk.room}
                                  </div>
                                </div>
                              ))
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Failed Bookings Section */}
        {failedBookings.length > 0 && (
          <div className="mt-6 bg-red-100 p-4 rounded">
            <h3 className="text-lg font-semibold text-red-700 mb-2">
              🚨 Failed Scheduling Attempts:
            </h3>
            <ul className="list-disc list-inside">
              {failedBookings.map((failure, index) => (
                <li key={index} className="text-red-700">
                  ❌ {failure}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )}
  </div>
)};
