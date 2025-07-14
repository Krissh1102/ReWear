# 👕 ReWear

**ReWear** is a sustainable clothing swap platform that promotes circular fashion.
Built with **Next.js**, **MongoDB**, and **Clerk**, it allows users to donate, claim, and manage wearable items, while tracking real-world impact.

---

## ✨ Features

* 🔐 **Authentication with Clerk** – Seamless login and signup.
* 📦 **Item Listings** – Users can create, view, and claim items.
* 🔄 **Swapping Logic** – Claim items added by others; view your own.
* 📈 **Admin Dashboard** – View user activity, control listings, and see impact stats.
* 💬 **User Testimonials** – Share and read experiences.
* 📊 **Impact Tracker** – Real-time statistics from the database.
* ❌ **Error Handling** – Friendly UI messages and robust backend validation.

---

## 🧰 Tech Stack

| Layer      | Tech Used               |
| ---------- | ----------------------- |
| Framework  | Next.js (App Router)    |
| Database   | MongoDB (via Mongoose)  |
| Auth       | Clerk                   |
| Styling    | Tailwind CSS + Radix UI |
| Charts     | Chart.js                |


---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/rewear.git
cd rewear
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file:

```env
MONGODB_URI=mongodb://localhost/reWear
CLERK_SECRET_KEY=your-clerk-secret-key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
```

🔑 You can get your Clerk keys from your Clerk Dashboard.

### 4. Run the App

```bash
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## 📂 Folder Structure

```
/
├── app/                 # App directory (pages, routes)
├── components/          # UI components (Card, Button, etc.)
├── hooks/               # Custom React hooks (useAuth, etc.)
├── lib/                 # Database config and utilities
├── public/              # Static assets
└── styles/              # Global styles (if any)
```

---

## 🔧 API Overview

| Route                  | Purpose                       |
| ---------------------- | ----------------------------- |
| `/api/items`           | CRUD operations for items     |
| `/api/items/[id]/swap` | Handle swap logic             |
| `/api/testimonials`    | Submit or fetch user feedback |
| `/api/stats`           | Fetch real-time impact stats  |



## 🙌 Acknowledgments

* Clerk.dev for seamless auth.
* Radix UI and Tailwind for great component accessibility.
* Chart.js for powerful data visualization.
* MongoDB for flexible data handling.

---

## Video Link

[https://drive.google.com/file/d/1jJK0QDHmWrfLLOn4EZ8bXR-1q_pSc4aM/view?usp=drivesdk](https://drive.google.com/file/d/1jJK0QDHmWrfLLOn4EZ8bXR-1q_pSc4aM/view?usp=drivesdk)

