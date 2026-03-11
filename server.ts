import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("placement.db");
const JWT_SECRET = "placement-portal-secret-key";

// Database Initialization
db.exec(`
  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rollNo TEXT UNIQUE,
    name TEXT,
    password TEXT,
    branch TEXT,
    cgpa REAL,
    skills TEXT,
    resumeURL TEXT,
    backlogs INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS companies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    role TEXT,
    package REAL,
    eligibility_cgpa REAL,
    eligibility_branch TEXT,
    deadline TEXT,
    description TEXT,
    status TEXT DEFAULT 'upcoming'
  );

  CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER,
    company_id INTEGER,
    status TEXT DEFAULT 'applied',
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(student_id) REFERENCES students(id),
    FOREIGN KEY(company_id) REFERENCES companies(id)
  );

  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  );

  CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed Data if empty
const seedCompanies = db.prepare("SELECT COUNT(*) as count FROM companies").get() as any;
if (seedCompanies.count === 0) {
  db.prepare("INSERT INTO companies (name, role, package, eligibility_cgpa, eligibility_branch, deadline, description) VALUES (?, ?, ?, ?, ?, ?, ?)")
    .run('Google', 'SDE-1', 32.0, 8.5, 'Computer Science', new Date().toISOString(), 'Cloud Infrastructure team.');
  db.prepare("INSERT INTO companies (name, role, package, eligibility_cgpa, eligibility_branch, deadline, description) VALUES (?, ?, ?, ?, ?, ?, ?)")
    .run('Meta', 'Product Engineer', 28.0, 8.0, 'Information Technology', new Date().toISOString(), 'Social platform scaling.');
}

const seedNews = db.prepare("SELECT COUNT(*) as count FROM news").get() as any;
if (seedNews.count === 0) {
  db.prepare("INSERT INTO news (title, content) VALUES (?, ?)")
    .run('Google Drive starting tomorrow!', 'All shortlisted candidates please report to Hall A at 9:00 AM sharp.');
  db.prepare("INSERT INTO news (title, content) VALUES (?, ?)")
    .run('New Partner: Microsoft', 'We are excited to announce Microsoft as our new hiring partner for the 2025 season.');
}

// Seed Admin if not exists
const seedAdmin = db.prepare("SELECT * FROM admins WHERE username = ?").get("admin");
if (!seedAdmin) {
  const hashedPassword = bcrypt.hashSync("admin123", 10);
  db.prepare("INSERT INTO admins (username, password) VALUES (?, ?)").run("admin", hashedPassword);
}

const seedAdmin2 = db.prepare("SELECT * FROM admins WHERE username = ?").get("admin2");
if (!seedAdmin2) {
  const hashedPassword = bcrypt.hashSync("admin123", 10);
  db.prepare("INSERT INTO admins (username, password) VALUES (?, ?)").run("admin2", hashedPassword);
}

// Seed Students if empty
const seedStudents = db.prepare("SELECT COUNT(*) as count FROM students").get() as any;
if (seedStudents.count === 0) {
  const studentsMock = [
    { rollNo: 'CS24001', name: 'Aarav Sharma', password: 'password', branch: 'Computer Science', cgpa: 8.9, skills: 'React, Node.js, TypeScript' },
    { rollNo: 'IT24042', name: 'Diya Patel', password: 'password', branch: 'Information Technology', cgpa: 9.1, skills: 'Python, Machine Learning, SQL' },
    { rollNo: 'CS24015', name: 'Rohan Gupta', password: 'password', branch: 'Computer Science', cgpa: 8.5, skills: 'Java, Spring Boot, MySQL' },
    { rollNo: 'EC24088', name: 'Sneha Reddy', password: 'password', branch: 'Electronics and Communication', cgpa: 7.8, skills: 'C++, IoT, Embedded Systems' },
    { rollNo: 'IT24021', name: 'Kabir Singh', password: 'password', branch: 'Information Technology', cgpa: 8.2, skills: 'Flutter, Firebase, Dart' },
    { rollNo: 'CS24099', name: 'Meera M', password: 'password', branch: 'Computer Science', cgpa: 9.5, skills: 'AWS, Kubernetes, Go, Docker' },
  ];

  const insertStudent = db.prepare("INSERT INTO students (rollNo, name, password, branch, cgpa, skills) VALUES (?, ?, ?, ?, ?, ?)");
  for (const s of studentsMock) {
    const hashedPassword = bcrypt.hashSync(s.password, 10);
    insertStudent.run(s.rollNo, s.name, hashedPassword, s.branch, s.cgpa, s.skills);
  }
}


async function startServer() {
  const app = express();
  const PORT = 4500;
  console.log("Starting server in mode:", process.env.NODE_ENV || "development");

  app.use(express.json());

  // Auth Middleware
  const authenticate = (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ error: "Invalid token" });
    }
  };

  // --- API Routes ---

  // Student Auth
  app.post("/api/auth/student/signup", (req, res) => {
    const { rollNo, name, password, branch, cgpa, skills } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    try {
      db.prepare("INSERT INTO students (rollNo, name, password, branch, cgpa, skills) VALUES (?, ?, ?, ?, ?, ?)")
        .run(rollNo, name, hashedPassword, branch, cgpa, skills);
      res.json({ success: true });
    } catch (err: any) {
      res.status(400).json({ error: "Roll number already exists" });
    }
  });

  app.post("/api/auth/student/login", (req, res) => {
    const { rollNo, password } = req.body;
    const student: any = db.prepare("SELECT * FROM students WHERE rollNo = ?").get(rollNo);
    if (student && bcrypt.compareSync(password, student.password)) {
      const token = jwt.sign({ id: student.id, role: "student", name: student.name }, JWT_SECRET);
      res.json({ token, user: { id: student.id, name: student.name, rollNo: student.rollNo, role: "student" } });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  // Admin Auth
  app.post("/api/auth/admin/signup", (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    try {
      db.prepare("INSERT INTO admins (username, password) VALUES (?, ?)").run(username, hashedPassword);
      res.json({ success: true });
    } catch (err: any) {
      res.status(400).json({ error: "Username already exists" });
    }
  });

  app.post("/api/auth/admin/login", (req, res) => {
    const { username, password } = req.body;
    const admin: any = db.prepare("SELECT * FROM admins WHERE username = ?").get(username);
    if (admin && bcrypt.compareSync(password, admin.password)) {
      const token = jwt.sign({ id: admin.id, role: "admin" }, JWT_SECRET);
      res.json({ token, user: { id: admin.id, role: "admin" } });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  app.get("/api/news", (req, res) => {
    const news = db.prepare("SELECT * FROM news ORDER BY created_at DESC").all();
    res.json(news);
  });

  app.post("/api/news", authenticate, (req: any, res: any) => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
    const { title, content } = req.body;
    db.prepare("INSERT INTO news (title, content) VALUES (?, ?)").run(title, content);
    res.json({ success: true });
  });

  app.get("/api/admin/download-report", authenticate, (req: any, res: any) => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
    const apps = db.prepare(`
      SELECT s.name as student_name, s.rollNo as student_rollNo, c.name as company_name, a.status, a.applied_at 
      FROM applications a 
      JOIN students s ON a.student_id = s.id 
      JOIN companies c ON a.company_id = c.id
    `).all() as any[];

    let csv = "Student Name,Roll No,Company,Status,Applied At\n";
    apps.forEach(app => {
      csv += `${app.student_name},${app.student_rollNo},${app.company_name},${app.status},${app.applied_at}\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=placement_report.csv");
    res.send(csv);
  });

  // Companies
  app.get("/api/companies", authenticate, (req: any, res: any) => {
    const companies = db.prepare("SELECT * FROM companies").all();
    res.json(companies);
  });

  app.post("/api/companies", authenticate, (req: any, res: any) => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
    const { name, role, package: pkg, eligibility_cgpa, eligibility_branch, deadline, description } = req.body;
    db.prepare("INSERT INTO companies (name, role, package, eligibility_cgpa, eligibility_branch, deadline, description) VALUES (?, ?, ?, ?, ?, ?, ?)")
      .run(name, role, pkg, eligibility_cgpa, eligibility_branch, deadline, description);
    res.json({ success: true });
  });

  app.delete("/api/companies/:id", authenticate, (req: any, res: any) => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
    db.prepare("DELETE FROM companies WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.put("/api/companies/:id", authenticate, (req: any, res: any) => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
    const { name, role, package: pkg, eligibility_cgpa, eligibility_branch, deadline, description } = req.body;
    db.prepare("UPDATE companies SET name=?, role=?, package=?, eligibility_cgpa=?, eligibility_branch=?, deadline=?, description=? WHERE id=?")
      .run(name, role, pkg, eligibility_cgpa, eligibility_branch, deadline, description, req.params.id);
    res.json({ success: true });
  });

  // Students
  app.get("/api/students", authenticate, (req: any, res: any) => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
    const students = db.prepare("SELECT id, rollNo, name, branch, cgpa, skills, resumeURL, backlogs FROM students").all();
    res.json(students);
  });

  // Applications
  app.post("/api/applications", authenticate, (req: any, res: any) => {
    const { company_id } = req.body;
    const student_id = req.user.id;

    // Check if already applied
    const existing = db.prepare("SELECT * FROM applications WHERE student_id = ? AND company_id = ?").get(student_id, company_id);
    if (existing) return res.status(400).json({ error: "Already applied" });

    db.prepare("INSERT INTO applications (student_id, company_id) VALUES (?, ?)").run(student_id, company_id);
    res.json({ success: true });
  });

  app.get("/api/applications/student", authenticate, (req: any, res: any) => {
    const apps = db.prepare(`
      SELECT a.*, c.name as company_name, c.role as company_role 
      FROM applications a 
      JOIN companies c ON a.company_id = c.id 
      WHERE a.student_id = ?
    `).all(req.user.id);
    res.json(apps);
  });

  app.get("/api/applications/admin", authenticate, (req: any, res: any) => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
    const apps = db.prepare(`
      SELECT a.*, s.name as student_name, s.rollNo as student_rollNo, c.name as company_name 
      FROM applications a 
      JOIN students s ON a.student_id = s.id 
      JOIN companies c ON a.company_id = c.id
    `).all();
    res.json(apps);
  });

  app.patch("/api/applications/:id", authenticate, (req: any, res: any) => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
    const { status } = req.body;
    db.prepare("UPDATE applications SET status = ? WHERE id = ?").run(status, req.params.id);
    res.json({ success: true });
  });

  // Stats
  app.get("/api/stats", authenticate, (req: any, res: any) => {
    const totalStudents = (db.prepare("SELECT COUNT(*) as count FROM students").get() as any).count;
    const totalPlaced = (db.prepare("SELECT COUNT(DISTINCT student_id) as count FROM applications WHERE status = 'selected'").get() as any).count;
    const avgPackage = (db.prepare("SELECT AVG(package) as avg FROM companies").get() as any).avg || 0;
    const highestPackage = (db.prepare("SELECT MAX(package) as max FROM companies").get() as any).max || 0;

    const branchStats = db.prepare(`
      SELECT s.branch, COUNT(DISTINCT a.student_id) as placed 
      FROM students s 
      LEFT JOIN applications a ON s.id = a.student_id AND a.status = 'selected'
      GROUP BY s.branch
    `).all();

    res.json({ totalStudents, totalPlaced, avgPackage, highestPackage, branchStats });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
