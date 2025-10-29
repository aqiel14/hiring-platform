# 💼 Job Application App

A modern full-stack job application platform with two main roles: **Admin (Recruiter)** and **Applicant (Job Seeker)**.  
Built using **Next.js 14 (App Router)** and **shadcn/ui**, featuring webcam photo capture, draggable tables, and full form management.

---

## 🧭 App Overview

### 👩‍💼 Admin (Recruiter)
Admins can:
- 📋 List, sort, and filter job postings  
- ➕ Create new job postings  
- ⚙️ Manage job submission forms (set fields as Mandatory / Optional / Off)  
- 👥 Manage candidates in a resizable, draggable, sortable, and filterable table view  

### 👨‍💻 Applicant (Job Seeker)
Applicants can:
- 🔍 View all available job listings  
- 📝 Apply to listed jobs  
- 🧾 Fill in personal information  
- 📸 Capture and upload a profile photo using **webcam gesture recognition**

---

## 🧰 Tech Stack Used

| Category | Technology |
|-----------|-------------|
| **Framework** | [Next.js 14 (App Router)](https://nextjs.org/) |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com/), Heroicons, Lucide Icons |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) |
| **State Management** | [Zustand](https://github.com/pmndrs/zustand) |
| **Form Handling** | [React Hook Form](https://react-hook-form.com/) |
| **Validation** | [Zod](https://zod.dev/) |
| **Hand Recognition (ML)** | [MediaPipe by Google](https://developers.google.com/mediapipe) |

---

## ⚙️ How to Run Locally

### 1️⃣ Install Dependencies
```bash
npm install
```

2️⃣ Run the Development Server
```bash
npm run dev
```

### 🔐 Mock Authentication Setup
To log in as an Admin or Applicant, open:
`src/constants/mockUsers.ts`

Replace or use the following mock users:

```bash
export const MOCK_USERS = [
  {
    id: "admin",
    username: "admin",
    role: "admin",
    name: "Admin User",
    email: "admin@example.com",
    password: "123456",
  },
  {
    id: "applicant_1",
    username: "applicant_1",
    role: "applicant",
    name: "Aqiel",
    email: "applicant@example.com",
    password: "123456",
  },
  {
    id: "applicant_2",
    username: "applicant_2",
    role: "applicant",
    name: "Rifqi",
    email: "applicant2@example.com",
    password: "123456",
  },
];
```

## 📦 Folder Structure

```bash
src/
 ┣ components/
 ┃ ┣ ui/                 # shadcn UI components
 ┃ ┣ GestureWebcamModal/ # Webcam gesture feature
 ┃ ┗ JobApplicationForm/ # Main form component
 ┣ store/
 ┃ ┗ jobStore.ts         # Zustand store for jobs
 ┣ constants/
 ┃ ┗ mockUsers.ts        # Authentication mock data
 ┣ app/
 ┃ ┣ admin/              # Admin dashboard and management views
 ┃ ┗ applicant/          # Applicant-facing pages
 ┗ utils/
```

## ✨ Features

✅ Admin & Applicant roles
✅ Form management (customizable fields)
✅ Webcam photo capture
✅ Dynamic sortable/filterable tables
✅ Zod validation & error handling
✅ Tailwind + shadcn responsive design

## 👤 Author

Developed by Aqiel Ilhamy 🇮🇩
💻 Software Developer 

## Screenshots

<img width="764" height="693" alt="image" src="https://github.com/user-attachments/assets/0e85a068-7fe5-4c05-899b-c41466d241bc" />
<img width="2506" height="944" alt="image" src="https://github.com/user-attachments/assets/297cc5d3-9418-4dac-b1a2-839f29e0ca41" />

<img width="2508" height="1212" alt="image" src="https://github.com/user-attachments/assets/5bf291a2-5d24-48f3-a161-53c8eff943f4" />
<img width="2491" height="747" alt="image" src="https://github.com/user-attachments/assets/5cfa97be-3254-4a9b-a6f5-3901af4078ef" />



<img width="2510" height="1106" alt="image" src="https://github.com/user-attachments/assets/96dd7b27-c403-4797-9f2d-6226d741483e" />
<img width="939" height="1004" alt="image" src="https://github.com/user-attachments/assets/897e9067-4a06-4c99-bdc3-6795d1a06cf6" />

<img width="1240" height="633" alt="image" src="https://github.com/user-attachments/assets/20259f99-c1f3-41fa-8df5-2de82eab3165" />

