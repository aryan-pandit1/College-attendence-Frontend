import { useState } from "react";
import "./Calendar.css";

const Calendar = () => {
  const [currentDate, setCurrentDate] =
    useState(new Date());

  const [view, setView] =
    useState("month");

  const [events, setEvents] = useState(() => {
    const saved =
      localStorage.getItem(
        "calendarEvents"
      );

    return saved
      ? JSON.parse(saved)
      : {
          2: {
            text: "OS Quiz",
            color: "purple",
          },
          3: {
            text: "DBMS Assign",
            color: "green",
          },
          10: {
            text: "Mid-Sem Exam",
            color: "pink",
          },
          16: {
            text: "OS Quiz 2",
            color: "orange",
          },
          21: {
            text: "SE Presentation",
            color: "blue",
          },
        };
  });

  const month =
    currentDate.getMonth();

  const year =
    currentDate.getFullYear();

  const monthName =
    currentDate.toLocaleString(
      "default",
      {
        month: "long",
      }
    );

  const daysInMonth =
    new Date(
      year,
      month + 1,
      0
    ).getDate();

  const days = Array.from(
    {
      length: daysInMonth,
    },
    (_, i) => i + 1
  );

  const changeMonth = (
    direction
  ) => {
    const newDate =
      new Date(
        year,
        month + direction,
        1
      );

    setCurrentDate(newDate);
  };

  const addEvent = () => {
    const day = prompt(
      "Enter Day:"
    );

    const title = prompt(
      "Enter Event Name:"
    );

    if (!day || !title) return;

    const updatedEvents = {
      ...events,
      [day]: {
        text: title,
        color: "purple",
      },
    };

    setEvents(updatedEvents);

    localStorage.setItem(
      "calendarEvents",
      JSON.stringify(
        updatedEvents
      )
    );
  };

  return (
    <div className="calendar-page">
      <div className="calendar-header">
        <h1>Academic Calendar</h1>

        <div className="calendar-controls">
          <button
            onClick={() =>
              changeMonth(-1)
            }
          >
            ◀
          </button>

          <h3>
            {monthName} {year}
          </h3>

          <button
            onClick={() =>
              changeMonth(1)
            }
          >
            ▶
          </button>
        </div>

        <div className="view-switch">
          <button
            className={
              view === "month"
                ? "active"
                : ""
            }
            onClick={() =>
              setView("month")
            }
          >
            Month
          </button>

          <button
            className={
              view === "list"
                ? "active"
                : ""
            }
            onClick={() =>
              setView("list")
            }
          >
            List
          </button>
        </div>
      </div>

      <button
        className="add-event-btn"
        onClick={addEvent}
      >
        + Add Event
      </button>

      {view === "month" ? (
        <div className="calendar-card">
          <div className="weekdays">
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
            <div>Sun</div>
          </div>

          <div className="calendar-grid">
            {days.map((day) => (
              <div
                key={day}
                className="day-cell"
              >
                <span className="date">
                  {day}
                </span>

                {events[day] && (
                  <div
                    className={`event ${
                      events[day]
                        .color
                    }`}
                  >
                    {
                      events[day]
                        .text
                    }
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="event-list">
          <h2>
            Upcoming Events
          </h2>

          {Object.entries(
            events
          ).map(
            ([day, event]) => (
              <div
                key={day}
                className="event-item"
              >
                <h4>
                  Day {day}
                </h4>

                <p>
                  {event.text}
                </p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default Calendar;