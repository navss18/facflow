import React from "react";
import { CATEGORIES, getDeadlineStatus, formatDate } from "../utils";

export default function Dashboard({ tasks, setActiveTab, onToggleComplete, onEditTask, onViewTask }) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;

  // Calculate overdue tasks
  const overdueTasks = tasks.filter((t) => {
    if (t.completed || !t.dueDate) return false;
    const today = new Date().toISOString().split("T")[0];
    return t.dueDate < today;
  });
  const overdue = overdueTasks.length;

  // Workload summary by category
  const categoryStats = CATEGORIES.map((cat) => {
    const catTasks = tasks.filter((t) => t.category === cat);
    const catCompleted = catTasks.filter((t) => t.completed).length;
    const catPending = catTasks.length - catCompleted;
    return {
      category: cat,
      total: catTasks.length,
      completed: catCompleted,
      pending: catPending
    };
  });

  // Upcoming / Urgent tasks (Pending tasks, prioritizing Overdue and High priority)
  const urgentTasks = tasks
    .filter((t) => !t.completed)
    .sort((a, b) => {
      // Overdue first
      const statusA = getDeadlineStatus(a).status === "Overdue" ? 1 : 0;
      const statusB = getDeadlineStatus(b).status === "Overdue" ? 1 : 0;
      if (statusA !== statusB) return statusB - statusA;

      // High priority next
      const pMap = { High: 3, Medium: 2, Low: 1 };
      const pDiff = (pMap[b.priority] || 1) - (pMap[a.priority] || 1);
      if (pDiff !== 0) return pDiff;

      // Due date next
      if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      return 0;
    })
    .slice(0, 4);

  return (
    <div className="dashboard-view">
      {/* 1. Quick Stats Cards */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon stat-total-icon">📑</div>
          <div className="stat-info">
            <span className="stat-value">{total}</span>
            <span className="stat-label">Total Tasks</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-completed-icon">✅</div>
          <div className="stat-info">
            <span className="stat-value">{completed}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-pending-icon">⏳</div>
          <div className="stat-info">
            <span className="stat-value">{pending}</span>
            <span className="stat-label">Pending</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-overdue-icon">⚠️</div>
          <div className="stat-info">
            <span className="stat-value">{overdue}</span>
            <span className="stat-label">Overdue</span>
          </div>
        </div>
      </section>

      {/* 2. Main Dashboard Content Grid */}
      <div className="dashboard-main-grid">
        {/* Workload Summary Section */}
        <section className="card workload-section">
          <div className="card-header">
            <div>
              <h2 className="card-title">Academic Workload Summary</h2>
              <p className="card-subtitle">Task distribution across teaching, research, and duties</p>
            </div>
            <span className="badge-pill">{total} total</span>
          </div>

          <div className="workload-list">
            {categoryStats.map((item) => {
              const percentage = total > 0 ? Math.round((item.total / total) * 100) : 0;
              return (
                <div key={item.category} className="workload-item">
                  <div className="workload-meta">
                    <span className={`category-tag tag-${item.category.toLowerCase()}`}>
                      {item.category}
                    </span>
                    <span className="workload-counts">
                      <strong>{item.total}</strong> tasks ({item.completed} completed, {item.pending} pending)
                    </span>
                  </div>
                  <div className="progress-bar-bg">
                    <div
                      className={`progress-bar-fill fill-${item.category.toLowerCase()}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Urgent & Upcoming Tasks Overview */}
        <section className="card urgent-section">
          <div className="card-header">
            <div>
              <h2 className="card-title">Urgent & Due Tasks</h2>
              <p className="card-subtitle">Immediate attention items</p>
            </div>
            <button className="text-btn" onClick={() => setActiveTab("tasks")}>
              View All &rarr;
            </button>
          </div>

          {urgentTasks.length === 0 ? (
            <div className="empty-state-small">
              <p>🎉 All caught up! No pending urgent tasks.</p>
            </div>
          ) : (
            <div className="urgent-list">
              {urgentTasks.map((t) => {
                const deadline = getDeadlineStatus(t);
                return (
                  <div key={t.id} className="urgent-item">
                    <div className="urgent-item-header">
                      <h4
                        className="urgent-title"
                        onClick={() => onViewTask(t)}
                        title="Click to view details"
                      >
                        {t.title}
                      </h4>
                      <span className={`status-badge ${deadline.className}`}>
                        {deadline.label}
                      </span>
                    </div>

                    <div className="urgent-meta">
                      <span className={`category-tag tag-${t.category.toLowerCase()}`}>
                        {t.category}
                      </span>
                      <span className={`priority-tag priority-${t.priority.toLowerCase()}`}>
                        {t.priority}
                      </span>
                      <span className="due-date-text">
                        📅 {formatDate(t.dueDate)}
                      </span>
                    </div>

                    <div className="urgent-actions">
                      <button
                        className="btn btn-sm btn-outline-success"
                        onClick={() => onToggleComplete(t)}
                      >
                        Mark Done
                      </button>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => onViewTask(t)}
                      >
                        Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
