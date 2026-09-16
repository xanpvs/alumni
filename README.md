# Alumni Portal - Backend API

A robust backend service and RESTful API for the **Alumni Portal** platform. This system facilitates seamless communication and networking between alumni, fellow graduates, and faculty members (professors), fostering a collaborative academic and professional ecosystem.

> **Note:** This repository is dedicated exclusively to the **backend** architecture and API services of the project.

---

## 🎯 Project Purpose

The primary objective of the **Alumni Portal** is to bridge the gap between graduates and their academic roots by providing a centralized platform where:
- **Alumni-to-Alumni Networking:** Graduates can reconnect with former classmates, share career achievements, and collaborate on professional endeavors.
- **Alumni-to-Faculty Engagement:** Alumni can stay in active communication with professors and faculty members for ongoing academic collaboration, mentorship, and guidance.
- **Career & Mentorship Opportunities:** Graduates and faculty can announce job openings, internship opportunities, and research collaborations.
- **Announcements & Reunions:** Stay up-to-date with department news, academic seminars, and alumni reunion events.

---

## 🛠 Tech Stack

- **Runtime & Language:** [Node.js](https://nodejs.org/) (JavaScript)
- **Database:** [MySQL](https://www.mysql.com/)
- **Containerization:** [Docker](https://www.docker.com/) & Docker Compose
- **Architecture:** RESTful API

---

## ✨ Core Responsibilities & Features (Backend)

- **Authentication & RBAC:** Secure user authentication and Role-Based Access Control distinguishing between Alumni, Faculty/Professors, and Administrators.
- **Alumni & Faculty Directory:** Endpoints for querying and filtering profiles by graduation year, department, academic title, and industry.
- **Communication & Mentorship:** Direct communication channels and mentorship inquiry systems connecting graduates and academic staff.
- **Event & Announcement Management:** APIs to manage university events, alumni reunions, and departmental announcements.
- **Profile & Career Tracking:** Profile endpoints supporting education history, current career milestones, and contact preferences.

---

## 🐳 Getting Started

### Prerequisites
Ensure you have the following installed on your local machine:
- [Docker](https://docs.docker.com/get-docker/) & Docker Compose
- [Node.js](https://nodejs.org/) (v18 or later recommended for local development)
- [npm](https://www.npmjs.com/)

### Running with Docker (Recommended)
```bash
# 1. Clone the repository
git clone https://github.com/xanpvs/alumni.git
cd alumni

# 2. Start services using Docker Compose
docker-compose up --build
```

---

## 📄 License

This project is developed for educational and academic collaboration purposes.
