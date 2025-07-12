import React, { useState } from "react";
// Removed: import { db } from "@/lib/firebase";
// Removed: import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const Feedback = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form }),
      });
      if (!res.ok) throw new Error("Failed to send feedback");
      setSuccess(true);
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setError("Failed to send feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#f8f6f3] py-20 w-full">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-4 text-[#2C2522]">
          📬 Share Your Thoughts with ReWear
        </h2>
        <p className="text-center text-[#4B403D] text-lg mb-10">
          Whether it’s feedback, a bug report, or a feature suggestion — we’d love to hear from you!
        </p>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[#2C2522]">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-[#ded6cf] shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2C2522]"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#2C2522]">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-[#ded6cf] shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2C2522]"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-[#2C2522]">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              value={form.message}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-[#ded6cf] shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2C2522] resize-none"
            ></textarea>
          </div>
          {success && (
            <div className="text-green-600 text-center font-medium">Thank you for your feedback!</div>
          )}
          {error && (
            <div className="text-red-600 text-center font-medium">{error}</div>
          )}
          <div className="text-center">
            <button
              type="submit"
              className="bg-[#2C2522] text-white px-6 py-2 rounded-md hover:bg-[#1f1a18] transition"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Feedback"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Feedback;
