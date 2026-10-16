import React from "react";
import { getDeadlineStatus, formatDate } from "../utils";

export default function TaskDetailModal({
  task,
  onClose,
  onEdit,
  onDelete,
  onToggleComplete
}) {
  if (!task) return null;

  const deadline = getDeadlineStatus(task);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-meta">
            <span className={`status-badge ${deadline.className}`}>
              {deadline.label}
            </span>
            <span className={`category-tag tag-${task.category.toLowerCase()}`}>
              {task.category}
            </span>
            <span className={`priority-tag priority-${task.priority.toLowerCase()}`}>
              {task.priority} Priority
            </span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>

        <div className="modal-body">
          <h2 className="modal-title">{task.title}</h2>

          <div className="modal-meta-grid">
            <div className="meta-box">
              <span className="meta-label">Due Date</span>
              <span className="meta-val">📅 {formatDate(task.dueDate)}</span>
            </div>
            <div className="meta-box">
              <span className="meta-label">Completion Status</span>
              <span className="meta-val">
                {task.completed ? "✅ Completed" : "⏳ Pending"}
              </span>
            </div>
            {task.createdAt && (
              <div className="meta-box">
                <span className="meta-label">Created At</span>
                <span className="meta-val">
                  {new Date(task.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                  })}
                </span>
              </div>
            )}
          </div>

          <div className="modal-desc-box">
            <h4 className="desc-heading">Task Notes & Description</h4>
            <p className="desc-text">
              {task.description || "No additional description provided for this task."}
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <div className="footer-left">
            <button
              className="btn btn-outline-danger"
              onClick={() => {
                onDelete(task.id, task.title);
                onClose();
              }}
            >
              🗑️ Delete
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={() => {
                onEdit(task);
                onClose();
              }}
            >
              ✏️ Edit
            </button>
          </div>

          <div className="footer-right">
            <button
              className={`btn ${task.completed ? "btn-secondary" : "btn-primary"}`}
              onClick={() => {
                onToggleComplete(task);
              }}
            >
              {task.completed ? "↩ Mark Incomplete" : "✓ Mark Complete"}
            </button>
            <button className="btn btn-outline-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
