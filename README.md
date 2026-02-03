# 🌟 UpliftAI - Student Micro-Advisor Platform

UpliftAI is a full-stack, AI-powered student support platform designed to help students manage academic stress, schedules, wellness, study planning, and emotional check-ins, while providing anonymous, aggregated insights to staff through a secure dashboard.

The project combines AI-driven guidance, mental wellness tools, and academic planning utilities into a single modern web platform, deployed using real-world cloud infrastructure.

Live application: https://uplift-ai.vercel.app/login

---

## Overview

UpliftAI acts as:
- A personal micro-advisor for students
- An analytics and insights dashboard for staff

It is designed to be supportive, lightweight, and privacy-conscious.

---

## Student Features

AI Micro-Advisor
- A conversational AI interface where students can share how they are feeling
- Supports topics like stress, workload, exams, motivation, and planning
- Powered by Google Gemini for natural, supportive responses

Academic Schedule Generator
- Generates a weekly academic rhythm based on:
  - Number of enrolled courses
  - Weekly work hours
  - Daily commute time
- Helps students visualize balance between study, work, and personal time
- Intended as a planning aid, not a rigid timetable

Wellness Toolbox
- Curated quick-reset wellness ideas students can use anytime
- Students can add their own custom wellness tips
- Tips persist locally in the browser using local storage

Study Plan Generator
- AI-assisted study plans for exams, assignments, and finals
- Breaks large goals into manageable steps

Reminders System
- Background reminder jobs managed via cron
- Designed to support future notification and email workflows

---

## Staff Features

Staff Dashboard
- Secure, staff-only dashboard
- Displays anonymous, aggregated student data
- No personally identifiable student information is exposed

Analytics Available
- Sentiment trends (positive, neutral, negative)
- Category trends (stress, workload, motivation, general)
- Message volume over time
- Usage patterns and peak activity

Role-Based Access Control
- Staff routes are protected using JWT authentication
- Middleware ensures only authorized staff can access analytics

---

## AI and Intelligence Layer

- Google Gemini API
  - Powers conversational support
  - Generates study plans and guidance
- Sentiment Analysis Service
  - Categorizes student messages for staff analytics
  - Feeds anonymized insights into the dashboard

---

## Tech Stack

Frontend
- React (Vite)
- Tailwind CSS
- React Router
- Vercel (hosting and CI/CD)

Backend
- Node.js
- Express.js
- MongoDB Atlas
- JWT Authentication
- Node-Cron (scheduled background jobs)
- PM2 (process manager)

Cloud and Infrastructure
- AWS Lightsail
  - Backend hosting
  - Ubuntu-based instance
  - PM2-managed Node process
- Nginx
  - Reverse proxy for backend
  - Routes traffic from port 80 to the Node server
- Vercel
  - Frontend hosting
  - Automatic deployments from GitHub

Email and Notifications
- SendGrid (Twilio)
  - Email testing and notification experiments
  - Integrated at the backend service layer

---

## Architecture

Browser (Student / Staff)
  -> HTTPS
Vercel (React + Vite Frontend)
  -> API requests to /api/*
Vercel rewrites /api/* to AWS Lightsail public endpoint
  -> Nginx (reverse proxy on port 80)
  -> Node.js + Express backend (PM2-managed, internal port 5000)
  -> MongoDB Atlas (database)

Notes:
- Frontend and backend are deployed independently
- Vercel handles frontend hosting and routes API calls to the backend
- Backend uses environment-based configuration for security

---

## Project Structure

```UpliftAI/
│
├── Backend/
│ ├── src/
│ │ ├── app.js
│ │ ├── server.js
│ │ ├── routes/
│ │ ├── models/
│ │ ├── middleware/
│ │ ├── services/
│ │ └── jobs/
│ ├── package.json
│ └── .env # not committed
│
├── Frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── state/
│ │ ├── utils/
│ │ └── main.jsx
│ ├── public/
│ ├── tailwind.config.js
│ ├── vite.config.js
│ └── package.json
│
├── vercel.json
├── README.md
└── .gitignore
```

---

## Security and Privacy

- JWT-based authentication
- Role-based authorization (Student vs Staff)
- Anonymous aggregation for analytics
- Environment variables for secrets
- CORS restricted to approved frontend origins
- No credentials or secrets committed to GitHub

---

## Deployment

Frontend (Vercel)
- Connected directly to GitHub
- Auto-deploys on every push to main
- Uses vercel.json for API rewrites

Backend (AWS Lightsail)
- Ubuntu instance
- Node process managed by PM2
- Nginx configured as reverse proxy
- MongoDB Atlas IP whitelisted
- Backend survives restarts and crashes

---

## Challenges and Lessons Learned

- Handling CORS between Vercel and AWS
- Debugging HTML error pages returned instead of JSON
- Managing environment variables across platforms
- Preventing cron jobs from crashing the server
- Ensuring backend reliability using PM2
- Debugging production-only issues with logs and curl
- Router external target errors when backend was unreachable
- Fixing API base URL and rewrites to avoid calling the frontend instead of the backend

How issues were resolved:
- PM2 log inspection
- Browser network debugging
- Incremental deployment testing
- Health-check endpoint validation
- Curl-based checks from Lightsail to confirm ports and routing
- Nginx reverse proxy configuration and verification

---

## Screenshots

- Login and Registration
  <img width="1918" height="1025" alt="image" src="https://github.com/user-attachments/assets/ff0cb991-3d28-4636-8904-a6557edabc24" />

- Student Dashboard
  <img width="1901" height="950" alt="image" src="https://github.com/user-attachments/assets/28539f5f-427e-4d9b-a9c3-ecde4f5e285d" />


- Study Plan (AI)
  <img width="1902" height="1026" alt="image" src="https://github.com/user-attachments/assets/7be1cd09-7158-47f9-a07a-2d53d41872bb" />

- Daily Reminders
  <img width="1902" height="380" alt="image" src="https://github.com/user-attachments/assets/4da365dd-9035-417f-9c73-7eff2dd7fe69" />
  <img width="1538" height="500" alt="image" src="https://github.com/user-attachments/assets/e7392f96-aa05-4a4f-b7f4-cde550bec330" />

- Staff Dashboard (Analytics)
  <img width="1898" height="1027" alt="image" src="https://github.com/user-attachments/assets/62d2afb8-c1e4-428a-9e95-694fc5c91a6f" />
  <img width="1891" height="1025" alt="image" src="https://github.com/user-attachments/assets/a9af1de3-f04e-4f8e-b199-9ad3f929565d" />



---

## Live Link

https://uplift-ai.vercel.app/login

---

## License

MIT License

Copyright (c) 2026 Manjeet Khanna

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

The Software is provided "as is", without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. In no event shall the authors or copyright holders be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the Software or the use or other dealings in the Software.

---

## Support

If you find this project useful:
- Star the repository
- Fork it
- Explore and extend it

---

## Author

Manjeet Khanna  
Full-Stack / Cloud / Data Engineer  
GitHub: https://github.com/ManjeetKhanna

Built with real-world deployment challenges, production debugging, and practical cloud architecture in mind.
