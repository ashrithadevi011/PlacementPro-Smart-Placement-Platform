# PlacementPro – AI Placement Management System

PlacementPro is a smart web-based platform designed to simplify the campus placement process for both students and administrators. The system provides two portals: a Student Portal and an Admin Portal. Students can register, check eligibility for placement drives, apply for jobs, track their applications, and analyze their resumes using AI. Administrators can manage placement drives, view student data, track placements, and post updates for students.
The goal of this platform is to make the placement process more organized, transparent, and efficient for colleges and students.


## Project Screenshots

## Image 1 – Landing Page:
This is the main homepage of the PlacementPro platform. It introduces the system with the message “Secure Your Future Today” and explains that the platform connects students with hiring companies. Users can either Get Started, Login, or access the Admin Portal from this page.

<img width="1454" height="889" alt="Screenshot 2026-03-08 061441" src="https://github.com/user-attachments/assets/acae3e0f-e464-4c53-a65d-c2f6d8277883" />


## Image 2 – Platform Features:
This section highlights the main features of the platform such as Eligibility Auto-Check, Real-time Application Tracking, AI Resume Matching and a Centralized Placement Hub. It also displays placement statistics like number of companies, highest package, and success rate.

<img width="1330" height="889" alt="Screenshot 2026-03-08 061505" src="https://github.com/user-attachments/assets/0b3b8297-6a00-4565-b4ee-3e38d4e2e3f9" />


## Image 3 – Company Trust Section:
This section shows well-known companies such as Google, Microsoft, Amazon, Meta, and Apple. It indicates that the platform connects students with top companies and encourages users to begin their placement journey.

<img width="1265" height="802" alt="Screenshot 2026-03-08 061520" src="https://github.com/user-attachments/assets/36aa9744-9dd1-4e17-aa0b-df58379dc74d" />


## Image 4 – Student Registration Page:
This page allows new students to create an account. Students enter their **name, roll number, branch, CGPA, skills, and password to register. After registration, they can access the student dashboard.

<img width="1366" height="856" alt="Screenshot 2026-03-08 061539" src="https://github.com/user-attachments/assets/40fd46e7-f32a-4d18-bc40-12c965ba366d" />


## Image 5 – Login Page:
The login page allows users to sign in as either Student or Admin. Students log in using their roll number and password, while administrators can log in to manage placement drives and student data.

<img width="1322" height="728" alt="Screenshot 2026-03-08 061552" src="https://github.com/user-attachments/assets/0d2ec9a0-8910-402a-b9de-20a3017ccdb6" />


## Image 6 – Student Dashboard:
The student dashboard shows active placement drives, eligibility details, deadlines, and offered packages. Students can also upload their resume for AI Resume Analysis and view updates about placement activities.

<img width="1400" height="613" alt="Screenshot 2026-03-08 061921" src="https://github.com/user-attachments/assets/1423b9ed-bd68-4c17-a5b1-a87cfb89c7ca" />


## Image 7 – Placement Updates and Application Tracker:
This section shows the **latest placement updates** posted by the admin and an **application tracker** where students can monitor the status of their job applications.

<img width="1376" height="825" alt="Screenshot 2026-03-08 061949" src="https://github.com/user-attachments/assets/ea5ee0b3-c59e-4186-adce-3a7d216816cf" />


## Image 8 – Admin Dashboard:
The admin dashboard helps the placement cell manage the system. It displays important statistics like **total students, placed students, success rate, and highest package** along with placement analytics.

<img width="1574" height="872" alt="Screenshot 2026-03-08 064025" src="https://github.com/user-attachments/assets/c537b62c-48a3-44be-9c34-d028a013d090" />


## Image 9 – Manage Drives and Students:
This page allows admins to add or manage placement drives, view student details, and track applications. Admins can also edit or delete drives and manage the student directory easily.

<img width="1517" height="879" alt="Screenshot 2026-03-08 064046" src="https://github.com/user-attachments/assets/72f198cf-4291-4192-8439-0442117fc987" />





## Folder Structure

```
placementpro/
│
├── node_modules/           # Installed project dependencies
│
├── src/                    # Main frontend source code
│   ├── components/         # Reusable UI components
│   ├── context/            # Global state management (React Context)
│   ├── pages/              # Application pages (Login, Dashboard, etc.)
│   ├── App.tsx             # Main React application component
│   ├── index.css           # Global styling
│   └── main.tsx            # Application entry point
│
├── .env.example            # Example environment configuration
├── .gitignore              # Git ignored files
├── index.html              # Main HTML template
├── INTERVIEW VIEW.txt      # Project notes / documentation
├── metadata.json           # Project metadata configuration
├── package.json            # Project dependencies and scripts
├── package-lock.json       # Dependency lock file
├── placement.db            # Database file for storing placement data
├── README.md               # Project documentation
├── run_app.bat             # Script to quickly start the application
├── server.ts               # Backend server file
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite configuration for frontend build
```

## Future Scope

In the future, this platform can be expanded with features like **AI interview preparation**, **automatic resume improvement suggestions**, **company-specific coding tests**, and **real-time interview scheduling**. It can also integrate with external job platforms to provide more opportunities for students and improve campus placement management.
