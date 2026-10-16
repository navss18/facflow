import React, { useState, useMemo } from "react";
import { CATEGORIES, PRIORITIES, getDeadlineStatus, formatDate } from "../utils";

export default function TaskList({
  tasks,
  onToggleComplete,
  onEditTask,
  onDeleteTask,
  onViewTask,
  onAddNew
}) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPriority, setSelectedPriority] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      // Search filter
      const matchesSearch =
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        (t.description && t.description.toLowerCase().includes(search.toLowerCase()));

      // Category filter
      const matchesCategory =
        selectedCategory === "All" || t.category === selectedCategory;

      // Priority filter
      const matchesPriority =
        selectedPriority === "All" || t.priority === selectedPriority;

      // Status filter
      const statusInfo = getDeadlineStatus(t);
      const matchesStatus =
        selectedStatus === "All" || statusInfo.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
    });
  }, [tasks, search, selectedCategory, selectedPriority, selectedStatus]);

  return (
    <div className="task-list-view">
      {/* Filter and Search Bar */}
      <div className="card filter-bar-card">
        <div className="filter-grid">
          <div className="filter-item search-box">
            <label className="filter-label">Search Tasks</label>
            <input
              type="text"
              className="form-input"
              placeholder="Search by title or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-item">
            <label className="filter-label">Category</label>
            <select
              className="form-input"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <label className="filter-label">Priority</label>
            <select
              className="form-input"
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
            >
              <option value="All">All Priorities</option>
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <label className="filter-label">Status</label>
            <select
              className="form-input"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>

        {(search || selectedCategory !== "All" || selectedPriority !== "All" || selectedStatus !== "All") && (
          <div className="filter-reset-row">
            <span>Showing {filteredTasks.length} of {tasks.length} tasks</span>
            <button
              className="text-btn"
              onClick={() => {
                setSearch("");
                setSelectedCategory("All");
                setSelectedPriority("All");
                setSelectedStatus("All");
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Task List / Cards */}
      <div className="tasks-container">
        {filteredTasks.length === 0 ? (
          <div className="card empty-state-card">
            <div className="empty-icon">📂</div>
            <h3>No Tasks Found</h3>
            <p>
              {tasks.length === 0
                ? "You don't have any tasks in Faculty Flow yet."
                : "No tasks matched your current search or filters."}
            </p>
            {tasks.length === 0 ? (
              <button className="btn btn-primary" onClick={onAddNew}>
                ➕ Create First Task
              </button>
            ) : (
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("All");
                  setSelectedPriority("All");
                  setSelectedStatus("All");
                }}
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          filteredTasks.map((t) => {
            const deadline = getDeadlineStatus(t);
            return (
              <article
                key={t.id}
                className={`task-card ${t.completed ? "task-completed" : ""} ${
                  deadline.status === "Overdue" && !t.completed ? "task-overdue-border" : ""
                }`}
              >
                <div className="task-main-content">
                  <div className="task-header-row">
                    <div className="task-checkbox-container">
                      <input
                        type="checkbox"
                        checked={t.completed}
                        onChange={() => onToggleComplete(t)}
                        title={t.completed ? "Mark incomplete" : "Mark complete"}
                        className="task-checkbox"
                      />
                    </div>

                    <div className="task-title-group">
                      <h3
                        className={`task-title ${t.completed ? "completed-title" : ""}`}
                        onClick={() => onViewTask(t)}
                        title="Click to view full details"
                      >
                        {t.title}
                      </h3>
                      {t.description && (
                        <p className="task-desc-preview">{t.description}</p>
                      )}
                    </div>

                    <div className="task-status-container">
                      <span className={`status-badge ${deadline.className}`}>
                        {deadline.label}
                      </span>
                    </div>
                  </div>

                  <div className="task-tags-row">
                    <span className={`category-tag tag-${t.category.toLowerCase()}`}>
                      {t.category}
                    </span>
                    <span className={`priority-tag priority-${t.priority.toLowerCase()}`}>
                      {t.priority}
                    </span>
                    <span className="due-date-text">
                      📅 Due: {formatDate(t.dueDate)}
                    </span>
                  </div>
                </div>

                <div className="task-actions-row">
                  <button
                    className="action-btn view-btn"
                    onClick={() => onViewTask(t)}
                    title="View task details"
                  >
                    👁️ View
                  </button>
                  <button
                    className="action-btn edit-btn"
                    onClick={() => onEditTask(t)}
                    title="Edit task"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => onDeleteTask(t.id, t.title)}
                    title="Delete task"
                  >
                    🗑️ Delete
                  </button>
                  <button
                    className={`action-btn toggle-btn ${
                      t.completed ? "btn-undo" : "btn-complete"
                    }`}
                    onClick={() => onToggleComplete(t)}
                  >
                    {t.completed ? "↩ Undo" : "✓ Done"}
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
