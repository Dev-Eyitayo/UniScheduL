import axios from 'axios';

// Base URL of the Flask API
const API_BASE_URL = 'http://127.0.0.1:5000/api';

// Fetch all lecturers
export const fetchLecturers = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/lecturers`);
        return response.data;
    } catch (error) {
        console.error('Error fetching lecturers:', error);
        return [];
    }
};

// Fetch all rooms
export const fetchRooms = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/rooms`);
        return response.data;
    } catch (error) {
        console.error('Error fetching rooms:', error);
        return [];
    }
};

// Fetch all courses
export const fetchCourses = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/courses`);
        return response.data;
    } catch (error) {
        console.error('Error fetching courses:', error);
        return [];
    }
};

// Fetch all timeslots
export const fetchTimeSlots = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/timeslots`);
        return response.data;
    } catch (error) {
        console.error('Error fetching time slots:', error);
        return [];
    }
};
