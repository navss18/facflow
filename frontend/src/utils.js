export const CATEGORIES = ["Teaching", "Research", "Grading", "Meeting", "Admin"];
export const PRIORITIES = ["Low", "Medium", "High"];

export function getDeadlineStatus(task) {
  if (task.completed) {
    return {
      status: "Completed",
      className: "status-completed",
      label: "Completed"
    };
  }
  if (!task.dueDate) {
    return {
      status: "Pending",
      className: "status-pending",
      label: "Pending (No date)"
    };
  }

  // Get current date in YYYY-MM-DD
  const today = new Date().toISOString().split("T")[0];
  if (task.dueDate < today) {
    return {
      status: "Overdue",
      className: "status-overdue",
      label: "Overdue"
    };
  }

  return {
    status: "Pending",
    className: "status-pending",
    label: "Pending"
  };
}

export function formatDate(dateString) {
  if (!dateString) return "No due date";
  try {
    const [year, month, day] = dateString.split("-");
    if (!year || !month || !day) return dateString;
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  } catch {
    return dateString;
  }
}
