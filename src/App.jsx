import { useState, useEffect } from "react";
import CountdownCircle from "./components/CountdownCircle";
import dayjs from "dayjs";
import "./index.css";

function App() {
  const saved = localStorage.getItem("tasks");
  const [tasks, setTasks] = useState(saved ? JSON.parse(saved) : []);
  const [form, setForm] = useState({ title: "", deadline: "", color: "#0ff" });
  const [editIndex, setEditIndex] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [toolbarMode, setToolbarMode] = useState(null);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdate = () => {
    if (!form.title || !form.deadline) return;
    const daysFromNow = dayjs(form.deadline).diff(dayjs(), "day");
    const newTask = {
      title: form.title,
      deadline: form.deadline,
      totalDays: daysFromNow,
      color: form.color,
    };

    if (editIndex !== null) {
      const updated = [...tasks];
      updated[editIndex] = newTask;
      setTasks(updated);
    } else {
      setTasks([...tasks, newTask]);
    }

    setForm({ title: "", deadline: "", color: "#0ff" });
    setEditIndex(null);
    setShowSidebar(false);
    setToolbarMode(null);
  };

  const handleDelete = (index) => {
    const confirmed = window.confirm("האם אתה בטוח שברצונך למחוק את המשימה?");
    if (!confirmed) return;
    const filtered = tasks.filter((_, i) => i !== index);
    setTasks(filtered);
    setToolbarMode(null);
  };

  const handleEdit = (index) => {
    const task = tasks[index];
    setForm({ title: task.title, deadline: task.deadline, color: task.color });
    setEditIndex(index);
    setShowSidebar(true);
  };

  return (
    <div className="main-container">
    <div className="header">
      <h1 className="title">Countdown to Greatness</h1>
      <p className="subtitle">// Don't count the days — make the days count.</p>
    </div>

    <div className="task-container">
      {tasks.map((task, index) => (
        <CountdownCircle
          key={index}
          {...task}
          onClick={() => toolbarMode === "edit" && handleEdit(index)}
          onDelete={toolbarMode === "delete" ? () => handleDelete(index) : null}
        />
      ))}
    </div>

      <button className="toolbox-btn" onClick={() => setToolbarMode(toolbarMode ? null : "menu")}>
        🧰
      </button>

      {toolbarMode === "menu" && (
        <div className="toolbar">
          <button onClick={() => {
            setShowSidebar(true);
            setEditIndex(null);
          }}>➕ הוסף שעון</button>
          <button onClick={() => setToolbarMode("edit")}>📝 ערוך שעון</button>
          <button onClick={() => setToolbarMode("delete")}>❌ הסר שעון</button>
        </div>
      )}

      {showSidebar && (
        <div className="sidebar">
          <h3>{editIndex !== null ? "ערוך משימה" : "הוסף משימה"}</h3>
          <input
            type="text"
            name="title"
            placeholder="שם המשימה"
            value={form.title}
            onChange={handleChange}
          />
          <input
            type="date"
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
          />
          <select name="color" value={form.color} onChange={handleChange}>
            <option value="#0ff">תכלת</option>
            <option value="#f0f">ורוד</option>
            <option value="#0f0">ירוק</option>
            <option value="#ff0">צהוב</option>
            <option value="#00f">כחול</option>
            <option value="#ffa500">כתום</option>
          </select>
          <button onClick={handleAddOrUpdate}>💾 שמור</button>
          <button className="close-btn" onClick={() => setShowSidebar(false)}>✖️ סגור</button>
        </div>
      )}
    </div>
  );
}

export default App;
