import api from "./axiosInstance";

// Get all calendar events
export const getCalendarEvents = async () => {
  const response = await api.get("/calendar/events/");
  return response.data;
};

// Get a single event
export const getEvent = async (id) => {
  const response = await api.get(`/calendar/events/${id}/`);
  return response.data;
};

// Create a new event
export const createEvent = async (eventData) => {
  const response = await api.post("/calendar/events/", eventData);
  return response.data;
};

// Update an existing event
export const updateEvent = async (id, eventData) => {
  const response = await api.put(
    `/calendar/events/${id}/`,
    eventData
  );
  return response.data;
};

// Delete an event
export const deleteEvent = async (id) => {
  const response = await api.delete(
    `/calendar/events/${id}/`
  );
  return response.data;
};

// Get events for a specific month
export const getMonthlyEvents = async (year, month) => {
  const response = await api.get(
    `/calendar/events/month/?year=${year}&month=${month}`
  );
  return response.data;
};

// Get upcoming events
export const getUpcomingEvents = async () => {
  const response = await api.get(
    "/calendar/events/upcoming/"
  );
  return response.data;
};