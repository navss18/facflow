import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/faculty-flow";

app.use(cors());
app.use(express.json());

// In-Memory Seed Data (used as fallback or initial demo tasks)
let inMemoryTasks = [
  {
    id: "1",
    title: "Prepare Operating Systems Lecture Slides",
    description: "Lecture 8: Virtual memory and page replacement algorithms for Section B",
    category: "Teaching",
    priority: "High",
    dueDate: "2026-10-02",
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: "2",
    title: "Grade Midterm Exam Papers (CS301)",
    description: "Evaluate answer scripts for 65 students and post marks to LMS",
    category: "Grading",
    priority: "High",
    dueDate: "2026-09-30",
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: "3",
    title: "Department Curriculum Committee Meeting",
    description: "Review syllabus revisions and new AI elective proposals in Conference Hall B",
    category: "Meeting",
    priority: "Medium",
    dueDate: "2026-10-05",
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: "4",
    title: "Submit Research Grant Progress Report",
    description: "Submit quarterly project progress update to DST/SERB funding portal",
    category: "Research",
    priority: "High",
    dueDate: "2026-09-25",
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: "5",
    title: "Submit Monthly Attendance and Lesson Plan",
    description: "Compile and upload student attendance percentages to ERP portal",
    category: "Admin",
    priority: "Low",
    dueDate: "2026-09-22",
    completed: true,
    createdAt: new Date().toISOString()
  }
];

// Optional Mongoose Schema
const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    category: {
      type: String,
      enum: ["Teaching", "Research", "Grading", "Meeting", "Admin"],
      default: "Teaching"
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium"
    },
    dueDate: { type: String, default: "" },
    completed: { type: Boolean, default: false }
  },
  { timestamps: true }
);

taskSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

let TaskModel = null;
let isConnectedToMongo = false;

// Attempt MongoDB connection with 2 second timeout
mongoose
  .connect(MONGODB_URI, { serverSelectionTimeoutMS: 2000 })
  .then(async () => {
    isConnectedToMongo = true;
    TaskModel = mongoose.model("Task", taskSchema);
    console.log("Connected to MongoDB at:", MONGODB_URI);

    const count = await TaskModel.countDocuments();
    if (count === 0) {
      await TaskModel.insertMany(
        inMemoryTasks.map(({ id, ...rest }) => rest)
      );
      console.log("Seeded initial sample tasks to MongoDB");
    }
  })
  .catch(() => {
    console.log("MongoDB not connected (optional). Running with In-Memory storage for demonstration.");
  });

// 1. GET all tasks
app.get("/api/tasks", async (req, res) => {
  try {
    if (isConnectedToMongo && TaskModel) {
      const tasks = await TaskModel.find().sort({ createdAt: -1 });
      return res.json(tasks);
    }
    res.json(inMemoryTasks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tasks", error: error.message });
  }
});

// 2. POST create a new task
app.post("/api/tasks", async (req, res) => {
  try {
    const { title, description, category, priority, dueDate, completed } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Task title is required" });
    }

    const newTaskData = {
      title: title.trim(),
      description: description ? description.trim() : "",
      category: ["Teaching", "Research", "Grading", "Meeting", "Admin"].includes(category)
        ? category
        : "Teaching",
      priority: ["Low", "Medium", "High"].includes(priority) ? priority : "Medium",
      dueDate: dueDate || "",
      completed: Boolean(completed)
    };

    if (isConnectedToMongo && TaskModel) {
      const createdTask = await TaskModel.create(newTaskData);
      return res.status(201).json(createdTask);
    }

    const newTask = {
      id: Date.now().toString(),
      ...newTaskData,
      createdAt: new Date().toISOString()
    };
    inMemoryTasks.unshift(newTask);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: "Failed to create task", error: error.message });
  }
});

// 3. PUT update an existing task
app.put("/api/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, priority, dueDate, completed } = req.body;

    if (isConnectedToMongo && TaskModel) {
      const updateData = {};
      if (title !== undefined) updateData.title = title.trim();
      if (description !== undefined) updateData.description = description.trim();
      if (category !== undefined) updateData.category = category;
      if (priority !== undefined) updateData.priority = priority;
      if (dueDate !== undefined) updateData.dueDate = dueDate;
      if (completed !== undefined) updateData.completed = completed;

      const updated = await TaskModel.findByIdAndUpdate(id, updateData, { new: true });
      if (!updated) {
        return res.status(404).json({ message: "Task not found" });
      }
      return res.json(updated);
    }

    const index = inMemoryTasks.findIndex(t => t.id === id);
    if (index === -1) {
      return res.status(404).json({ message: "Task not found" });
    }

    inMemoryTasks[index] = {
      ...inMemoryTasks[index],
      ...(title !== undefined && { title: title.trim() }),
      ...(description !== undefined && { description: description.trim() }),
      ...(category !== undefined && { category }),
      ...(priority !== undefined && { priority }),
      ...(dueDate !== undefined && { dueDate }),
      ...(completed !== undefined && { completed })
    };

    res.json(inMemoryTasks[index]);
  } catch (error) {
    res.status(500).json({ message: "Failed to update task", error: error.message });
  }
});

// 4. DELETE a task
app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (isConnectedToMongo && TaskModel) {
      const deleted = await TaskModel.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ message: "Task not found" });
      }
      return res.json({ message: "Task deleted successfully" });
    }

    const initialLength = inMemoryTasks.length;
    inMemoryTasks = inMemoryTasks.filter(t => t.id !== id);

    if (inMemoryTasks.length === initialLength) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete task", error: error.message });
  }
});

// 5. Health status endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "Faculty Flow API",
    storage: isConnectedToMongo ? "MongoDB" : "In-Memory (Mock)",
    taskCount: isConnectedToMongo ? "dynamic" : inMemoryTasks.length
  });
});

app.listen(PORT, () => {
  console.log(`Faculty Flow API running on port ${PORT}`);
});
