// src/Components/EventModal.jsx
import { useState, useEffect } from "react";

const CATEGORIES = [
  "Exam",
  "Assignment",
  "Quiz",
  "Goal",
  "Study Session",
  "Holiday",
  "Personal Event",
  "Other",
];

const PRIORITIES = ["High", "Medium", "Low"];

const EventModal = ({ isOpen, onClose, onSave, onDelete, initialDate, selectedEvent }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    start_time: "09:00",
    end_time: "10:00",
    category: "Assignment",
    priority: "Medium",
    completed: false,
  });

  useEffect(() => {
    if (selectedEvent) {
      setFormData({
        ...selectedEvent,
        start_time: selectedEvent.start_time?.slice(0, 5) || "",
        end_time: selectedEvent.end_time?.slice(0, 5) || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        date: initialDate || new Date().toISOString().split("T")[0],
        start_time: "09:00",
        end_time: "10:00",
        category: "Assignment",
        priority: "Medium",
        completed: false,
      });
    }
  }, [selectedEvent, initialDate, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date) return;
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{selectedEvent ? "Edit Event" : "Create New Event"}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., DBMS Internal"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Priority</label>
              <select name="priority" value={formData.priority} onChange={handleChange}>
                {PRIORITIES.map((pri) => (
                  <option key={pri} value={pri}>{pri}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Date *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Time</label>
              <input
                type="time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>End Time</label>
              <input
                type="time"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Study Unit 3 and Unit 4..."
            />
          </div>

          {selectedEvent && (
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="completed"
                  checked={formData.completed}
                  onChange={handleChange}
                />
                Mark as Completed
              </label>
            </div>
          )}

          <div className="modal-actions">
            {selectedEvent && (
              <button
                type="button"
                className="btn-delete"
                onClick={() => onDelete(selectedEvent.id)}
              >
                Delete
              </button>
            )}
            <div className="right-actions">
              <button type="button" className="btn-cancel" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-save">
                {selectedEvent ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;