// src/services/calendarService.js

import axiosInstance from "./axiosInstance";

// Get all events
export const fetchEvents = async (params = {}) => {
  const response = await axiosInstance.get("calendar/events/", {
    params,
  });
  return response.data;
};

// Create event
export const createEvent = async (eventData) => {
  const response = await axiosInstance.post(
    "calendar/events/",
    eventData
  );
  return response.data;
};

// Update event
export const updateEvent = async (id, eventData) => {
  const response = await axiosInstance.patch(
    `calendar/events/${id}/`,
    eventData
  );
  return response.data;
};

// Delete event
export const deleteEvent = async (id) => {
  await axiosInstance.delete(
    `calendar/events/${id}/`
  );
  return id;
};