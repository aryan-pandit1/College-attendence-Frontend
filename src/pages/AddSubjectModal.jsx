import { useState } from "react";
import { addCourse } from "../services/courseService";
import "./AddSubjectModal.css";

const AddSubjectModal = ({ closeModal }) => {
  

const [name, setName] = useState("");
const [code, setCode] = useState("");
const [semester, setSemester] = useState("1");
const [credits, setCredits] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !code || !credits) {
      alert("Please fill all fields");
      return;
    }

    try {

  await addCourse({
    course_name: name,
    course_code: code.toUpperCase(),
    semester: Number(semester),
    credits: Number(credits),
});

  alert("Subject added successfully.");

  window.location.reload();

} catch (err) {

  console.error(err);

  alert("Failed to add subject.");

}
  };

  return (
    <div
      className="modal-overlay"
      onClick={closeModal}
    >
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>📚 Add Subject</h2>

        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <label>Subject Name</label>

            <input
              type="text"
              placeholder="Enter Subject Name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />
          </div>

          <div className="input-group">
            <label>Subject Code</label>

            <input
              type="text"
              placeholder="CS201"
              value={code}
              onChange={(e) =>
                setCode(e.target.value)
              }
            />
          </div>

          <div className="input-group">
  <label>Semester</label>

  <select
    value={semester}
    onChange={(e) => setSemester(e.target.value)}
  >
    <option value="1">Semester 1</option>
    <option value="2">Semester 2</option>
    <option value="3">Semester 3</option>
    <option value="4">Semester 4</option>
    <option value="5">Semester 5</option>
    <option value="6">Semester 6</option>
    <option value="7">Semester 7</option>
    <option value="8">Semester 8</option>
  </select>
</div>

          <div className="input-group">
            <label>Credits</label>

            <input
              type="number"
              placeholder="4"
              value={credits}
              onChange={(e) =>
                setCredits(e.target.value)
              }
            />
          </div>

          <div className="modal-buttons">
            <button
              type="button"
              className="cancel-btn"
              onClick={closeModal}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="add-btn"
            >
              Add Subject
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddSubjectModal;