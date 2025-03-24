import authFetch from "./utils/authFetch";

const API_BASE_URL = "http://127.0.0.1:8000/api";

// 🔍 Lecturers
export const fetchLecturers = async () => {
  try {
    return await authFetch(`${API_BASE_URL}/lecturers`);
  } catch (error) {
    console.error("Error fetching lecturers:", error);
    return [];
  }
};

export const addLecturer = async (lecturer) => {
  try {
    return await authFetch(`${API_BASE_URL}/lecturers`, {
      method: "POST",
      body: JSON.stringify(lecturer),
    });
  } catch (error) {
    console.error("Error adding lecturer:", error);
  }
};

export const updateLecturer = async (id, lecturer) => {
  try {
    return await authFetch(`${API_BASE_URL}/lecturers/${id}`, {
      method: "PUT",
      body: JSON.stringify(lecturer),
    });
  } catch (error) {
    console.error("Error updating lecturer:", error);
  }
};

export const deleteLecturer = async (id) => {
  try {
    return await authFetch(`${API_BASE_URL}/lecturers/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("Error deleting lecturer:", error);
  }
};

// 🏫 Rooms
export const fetchRooms = async () => {
  try {
    return await authFetch(`${API_BASE_URL}/rooms`);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return [];
  }
};

// 📘 Courses
export const fetchCourses = async () => {
  try {
    return await authFetch(`${API_BASE_URL}/courses`);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
};

// 🕒 TimeSlots
export const fetchTimeSlots = async () => {
  try {
    return await authFetch(`${API_BASE_URL}/timeslots`);
  } catch (error) {
    console.error("Error fetching time slots:", error);
    return [];
  }
};
