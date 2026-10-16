import React from "react";

export default function Navbar({ activeTab, setActiveTab, taskCount, serverInfo }) {
  return (
    <header className="navbar">
      <div className="navbar-top">
        <div className="brand" onClick={() => setActiveTab("dashboard")}>
          <div className="brand-icon">🎓</div>
          <div>
            <h1 className="brand-title">Faculty Flow</h1>
            <p className="brand-tagline">Organize Work. Save Time. Focus on Teaching.</p>
          </div>
        </div>

        {serverInfo && (
          <div className="server-badge" title="Backend Status">
            <span className="status-dot"></span>
            <span>API Online ({serverInfo.storage || "Ready"})</span>
          </div>
        )}
      </div>

      <nav className="nav-tabs">
        <button
          className={`nav-btn ${activeTab === "dashboard" ? "active" : ""}`}
          onClick={() => setActiveTab("dashboard")}
        >
          📊 Dashboard
        </button>
        <button
          className={`nav-btn ${activeTab === "tasks" ? "active" : ""}`}
          onClick={() => setActiveTab("tasks")}
        >
          📋 Task List
          <span className="count-pill">{taskCount}</span>
        </button>
        <button
          className={`nav-btn add-btn ${activeTab === "add" ? "active" : ""}`}
          onClick={() => setActiveTab("add")}
        >
          ➕ Add Task
        </button>
      </nav>
    </header>
  );
}
