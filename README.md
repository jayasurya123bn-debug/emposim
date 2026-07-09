# 🎓 Emposim — GTEC National Level Technical Symposium Portal

> A full-stack web portal for managing symposium registrations, event selection, payments, and admin verification at **Ganadipathy Tulsi's Jain Engineering College (GTEC)**.

![Tech Stack](https://img.shields.io/badge/Frontend-HTML%20%7C%20CSS%20%7C%20JS-blue)
![Backend](https://img.shields.io/badge/Backend-PHP%207.4+-purple)
![Database](https://img.shields.io/badge/Database-MySQL-orange)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📋 Features

### Student Portal
- 🔐 **Security Verification** — Animated landing page with progress bar
- 📝 **Registration** — Full student registration with form validation
- 🗂️ **Events Grid** — Browse 6 symposium events with venue & fee details
- 🎯 **Topic Selection** — Choose your event via styled radio buttons
- ✅ **Confirmation** — Review details with Online/Offline toggle
- 💳 **Payment Checkout** — UPI QR code with 5-minute countdown timer
- ⏳ **Verification Step** — Payment processing animation
- 📤 **Screenshot Upload** — Drag & drop upload with 2MB file limit

### Admin Panel
- 🔑 **Secure Login** — Admin authentication (session-based)
- 📊 **Dashboard** — Stats overview (total, approved, pending, rejected)
- 📋 **Registrations** — View all students in a searchable table
- 💳 **Payments** — View payment details and uploaded screenshots
- ✅ **Verification** — Approve/Reject registrations with one click

---

## 🛠️ Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | HTML5, CSS3 (Vanilla), JavaScript   |
| Backend   | PHP 7.4+                            |
| Database  | MySQL 5.7+ / MariaDB               |
| Fonts     | Google Fonts (Inter, Outfit)        |
| Design    | Glassmorphism, Dark Theme           |

---

## 📁 Project Structure

```
emposim/
├── index.html              # Landing page (security verification)
├── register.html           # Student registration form
├── events.html             # Events grid + venue location
├── select-topic.html       # Topic/event selection
├── topic-details.html      # Confirmation + online/offline toggle
├── payment.html            # UPI QR + countdown timer
├── verifying.html          # Payment verification spinner
├── upload.html             # Screenshot upload form
├── css/
│   └── style.css           # Global design system
├── js/
│   ├── verification.js     # Landing page animations
│   ├── register.js         # Registration form logic
│   ├── events.js           # Event card rendering
│   ├── select-topic.js     # Topic selection logic
│   ├── topic-details.js    # Confirmation page logic
│   ├── payment.js          # Countdown timer + QR
│   ├── verifying.js        # Auto-redirect (2s)
│   └── upload.js           # File upload validation
├── php/
│   ├── db.php              # Database connection (PDO)
│   ├── init_db.php         # Creates tables + seeds events
│   ├── register.php        # Registration handler
│   ├── get_events.php      # Events JSON API
│   ├── select_topic.php    # Topic selection handler
│   └── upload.php          # Screenshot upload handler
├── admin/
│   ├── index.html          # Admin login page
│   ├── dashboard.html      # Admin dashboard
│   ├── css/
│   │   └── admin.css       # Admin panel styles
│   ├── js/
│   │   ├── login.js        # Admin login logic
│   │   └── dashboard.js    # Dashboard + approve/reject
│   └── php/
│       ├── login.php       # Admin auth endpoint
│       ├── get_registrations.php
│       ├── get_payments.php
│       ├── update_status.php
│       └── logout.php
├── uploads/                # Payment screenshots (runtime)
│   └── .gitkeep
└── README.md               # This file
```

---

## 🚀 Setup Instructions

### Prerequisites

- **XAMPP** (or WAMP/MAMP) with Apache & MySQL
- PHP 7.4 or higher
- MySQL 5.7 or higher
- A modern web browser (Chrome, Firefox, Edge)

### Step 1: Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/emposim.git
```

### Step 2: Move to XAMPP's htdocs

Copy the `emposim` folder to your XAMPP's `htdocs` directory:

```
C:\xampp\htdocs\emposim\
```

### Step 3: Start Apache & MySQL

Open **XAMPP Control Panel** and start:
- ✅ Apache
- ✅ MySQL

### Step 4: Initialize the Database

Open your browser and visit:

```
http://localhost/emposim/php/init_db.php
```

This will:
- Create the `emposim` database
- Create `events` and `registrations` tables
- Seed 6 sample events

### Step 5: Open the Portal

Visit the student portal:
```
http://localhost/emposim/
```

Visit the admin panel:
```
http://localhost/emposim/admin/
```

---

## 🔑 Admin Credentials

| Field    | Value      |
|----------|------------|
| Username | `admin`    |
| Password | `admin123` |

> ⚠️ **Note:** These are hardcoded credentials for demo purposes. In production, use hashed passwords stored in the database.

---

## 🗄️ Database Schema

### `events` table
| Column       | Type           | Description          |
|-------------|----------------|----------------------|
| id          | INT (PK, AI)   | Event ID             |
| event_name  | VARCHAR(150)   | Name of the event    |
| description | TEXT           | Event description    |
| venue       | VARCHAR(200)   | Event venue          |
| entry_fee   | DECIMAL(10,2)  | Registration fee     |
| created_at  | TIMESTAMP      | Record creation time |

### `registrations` table
| Column              | Type                          | Description            |
|--------------------|-------------------------------|------------------------|
| id                 | INT (PK, AI)                  | Registration ID        |
| student_name       | VARCHAR(100)                  | Student's full name    |
| email              | VARCHAR(150), UNIQUE          | Email address          |
| password           | VARCHAR(255)                  | Bcrypt hashed password |
| phone              | VARCHAR(15)                   | Phone number           |
| college            | VARCHAR(200)                  | College name           |
| year               | VARCHAR(20)                   | Year of study          |
| department         | VARCHAR(100)                  | Department             |
| event_topic        | VARCHAR(150)                  | Selected event         |
| entry_fee          | DECIMAL(10,2)                 | Event fee              |
| payment_mode       | ENUM('online','offline')      | Payment method         |
| payment_screenshot | VARCHAR(255)                  | Upload file path       |
| status             | ENUM('pending','approved','rejected') | Verification status |
| created_at         | TIMESTAMP                     | Registration time      |

---

## 🔒 Security Features

- ✅ **Password Hashing** — Uses PHP `password_hash()` with BCRYPT
- ✅ **Prepared Statements** — PDO prepared statements prevent SQL injection
- ✅ **Input Sanitization** — `htmlspecialchars()` and `filter_var()` on all inputs
- ✅ **File Validation** — Server-side MIME type check + 2MB size limit
- ✅ **XSS Prevention** — HTML escaping in JavaScript rendering
- ✅ **Session Management** — PHP sessions for admin authentication

---

## 📸 Screenshots

> Add screenshots of your running application here for your project submission.

---

## 👨‍💻 Author

**Your Name**  
B.Tech Information Technology  
Ganadipathy Tulsi's Jain Engineering College (GTEC)

---

## 📄 License

This project is created for educational purposes as part of the **Emposim 2026** college symposium at GTEC.
