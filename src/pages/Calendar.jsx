import { useState, useEffect, useMemo } from "react";
import EventModal from "../Components/EventModal";
import * as CalendarService from "../services/calendarService";
import "./Calendar.css";

const CATEGORY_COLORS = {
  Exam: "cat-exam",
  Assignment: "cat-assignment",
  Quiz: "cat-quiz",
  Study: "cat-study",
  Goal: "cat-goal",
  Holiday: "cat-holiday",
  Personal: "cat-personal",
  Other: "cat-other",
};

const Calendar = ({ darkMode }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [view, setView] = useState("month");
  
  // Filtering & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalDate, setModalDate] = useState("");

  // Calendar Math
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const monthName = currentDate.toLocaleString("default", { month: "long" });

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7;

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptySlots = Array.from({ length: firstDayIndex }, (_, i) => i);

  const changeMonth = (direction) => {
    setCurrentDate(new Date(year, month + direction, 1));
  };

  const loadEvents = async () => {
    try {
      const data = await CalendarService.fetchEvents({ year, month: month + 1 });
      setEvents(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      console.error("Failed to fetch calendar events:", error);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [month, year]);

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      const matchesSearch =
        (ev.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ev.description || "").toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === "All" || ev.category === selectedCategory;
      
      const matchesStatus =
        selectedStatus === "All" ||
        (selectedStatus === "Completed" && ev.completed) ||
        (selectedStatus === "Pending" && !ev.completed);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [events, searchQuery, selectedCategory, selectedStatus]);

  // Group events by date string (YYYY-MM-DD)
  const eventsByDate = useMemo(() => {
    const map = {};
    filteredEvents.forEach((ev) => {
      if (!ev.date) return;
      if (!map[ev.date]) map[ev.date] = [];
      map[ev.date].push(ev);
    });
    return map;
  }, [filteredEvents]);

  // Handlers
  const handleOpenCreateModal = (day = null) => {
    setSelectedEvent(null);
    if (day) {
      const formattedMonth = String(month + 1).padStart(2, "0");
      const formattedDay = String(day).padStart(2, "0");
      setModalDate(`${year}-${formattedMonth}-${formattedDay}`);
    } else {
      const now = new Date();
      const localDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
      setModalDate(localDate);
    }
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (event, e) => {
    if (e) e.stopPropagation();
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleSaveEvent = async (eventData) => {
    try {
      if (selectedEvent) {
        const updated = await CalendarService.updateEvent(selectedEvent.id, eventData);
        setEvents((prev) => prev.map((ev) => (ev.id === updated.id ? updated : ev)));
      } else {
        const created = await CalendarService.createEvent(eventData);
        setEvents((prev) => [...prev, created]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Backend Error Details:", error.response?.data || error);
      const errData = error.response?.data;
      let errorMessage = "Unable to save event.";

      if (errData?.detail) {
        errorMessage = errData.detail;
      } else if (typeof errData === "object" && errData !== null) {
        errorMessage = Object.entries(errData)
          .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(" ") : msgs}`)
          .join("\n");
      }
      alert(errorMessage);
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      await CalendarService.deleteEvent(id);
      setEvents((prev) => prev.filter((ev) => ev.id !== id));
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleToggleComplete = async (ev, e) => {
    e.stopPropagation();
    try {
      const updated = await CalendarService.updateEvent(ev.id, { completed: !ev.completed });
      setEvents((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    } catch (error) {
      console.error("Error updating completion status:", error);
    }
  };

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className={`calendar-page full-screen-layout ${darkMode ? "forced-dark" : ""}`}>
      {/* Top Header */}
      <div className="calendar-header">
        <div className="header-title">
          <h1>Academic Calendar</h1>
          <button className="add-event-btn" onClick={() => handleOpenCreateModal()}>
            + Add Event
          </button>
        </div>

        <div className="calendar-controls">
          <button onClick={() => changeMonth(-1)}>◀</button>
          <h3>{monthName} {year}</h3>
          <button onClick={() => changeMonth(1)}>▶</button>
        </div>

        <div className="view-switch">
          <button className={view === "month" ? "active" : ""} onClick={() => setView("month")}>
            Month
          </button>
          <button className={view === "list" ? "active" : ""} onClick={() => setView("list")}>
            List
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="calendar-toolbar">
        <input
          type="text"
          placeholder="🔍 Search assignments, exams..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />

        <div className="filters-group">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            <option value="All">All Categories</option>
            {Object.keys(CATEGORY_COLORS).map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="filter-select"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Calendar Views */}
      {view === "month" ? (
        <div className="calendar-card">
          <div className="weekdays">
            <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div>
          </div>

          <div className="calendar-grid">
            {emptySlots.map((slot) => (
              <div key={`empty-${slot}`} className="day-cell empty-cell" />
            ))}

            {days.map((day) => {
              const formattedDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const isToday = formattedDate === todayStr;
              const dayEvents = eventsByDate[formattedDate] || [];

              return (
                <div
                  key={day}
                  className={`day-cell ${isToday ? "today" : ""}`}
                  onClick={() => handleOpenCreateModal(day)}
                >
                  <div className="day-header">
                    <span className="date-number">{day}</span>
                  </div>

                  <div className="day-events">
                    {dayEvents.map((ev) => {
                      const categoryClass = CATEGORY_COLORS[ev.category] || "cat-other";
                      return (
                        <div
                          key={ev.id}
                          className={`event-pill ${categoryClass} ${ev.completed ? "completed" : ""}`}
                          onClick={(e) => handleOpenEditModal(ev, e)}
                        >
                          <span
                            className="complete-check"
                            onClick={(e) => handleToggleComplete(ev, e)}
                          >
                            {ev.completed ? "✓" : "○"}
                          </span>
                          <span className="event-text">{ev.title}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* List View */
        <div className="event-list-view">
          <h2>Upcoming & Filtered Events</h2>
          {filteredEvents.length === 0 ? (
            <p className="no-events">No events found matching your filters.</p>
          ) : (
            <div className="list-grid">
              {filteredEvents
                .sort((a, b) => {
                  const aDate = new Date(`${a.date || "1970-01-01"}T${a.start_time || "00:00"}`);
                  const bDate = new Date(`${b.date || "1970-01-01"}T${b.start_time || "00:00"}`);
                  return aDate - bDate;
                })
                .map((ev) => {
                  const categoryClass = CATEGORY_COLORS[ev.category] || "cat-other";
                  const safeTime = ev.start_time ? String(ev.start_time).slice(0, 5) : "All day";
                  
                  return (
                    <div
                      key={ev.id}
                      className={`event-list-item ${categoryClass} ${ev.completed ? "completed" : ""}`}
                      onClick={() => handleOpenEditModal(ev)}
                    >
                      <div className="list-item-left">
                        <button
                          className="list-check-btn"
                          onClick={(e) => handleToggleComplete(ev, e)}
                        >
                          {ev.completed ? "✓" : "○"}
                        </button>
                        <div>
                          <h4>{ev.title}</h4>
                          <p className="list-meta">
                            📅 {ev.date} | ⏰ {safeTime} | 🏷️ {ev.category || "Other"}
                          </p>
                          {ev.description && <p className="list-desc">{ev.description}</p>}
                        </div>
                      </div>
                      {ev.priority && (
                        <div className={`priority-badge priority-${String(ev.priority).toLowerCase()}`}>
                          {ev.priority}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        initialDate={modalDate}
        selectedEvent={selectedEvent}
      />
    </div>
  );
};

export default Calendar;