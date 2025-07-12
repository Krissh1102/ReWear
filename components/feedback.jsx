import React from "react";

const Feedback = () => {
  return (
    <section className="bg-[#f8f6f3] py-20 w-full">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-4 text-[#2C2522]">
          📬 Share Your Thoughts with ReWear
        </h2>
        <p className="text-center text-[#4B403D] text-lg mb-10">
          Whether it’s feedback, a bug report, or a feature suggestion — we’d love to hear from you!
        </p>

        <form className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[#2C2522]">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
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
              className="mt-1 block w-full rounded-md border border-[#ded6cf] shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2C2522] resize-none"
            ></textarea>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-[#2C2522] text-white px-6 py-2 rounded-md hover:bg-[#1f1a18] transition"
            >
              Send Feedback
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Feedback;
