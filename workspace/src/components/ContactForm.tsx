import { useState } from 'react';
import axios from 'axios';
import Head from 'next/head';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  // Honeypot field – should remain empty
  _gotcha?: string;
}

const initialState: FormData = {
  name: '',
  email: '',
  subject: '',
  message: '',
  _gotcha: '',
};

function validateEmail(email: string): boolean {
  // Simple RFC 5322‑compatible regex
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export default function ContactForm() {
  const [form, setForm] = useState<FormData>(initialState);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [spam, setSpam] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error for field on change
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!validateEmail(form.email)) newErrors.email = 'Invalid email address';
    if (!form.subject.trim()) newErrors.subject = 'Subject is required';
    if (!form.message.trim()) newErrors.message = 'Message is required';
    // Honeypot check – if filled, treat as spam
    if (form._gotcha && form._gotcha.trim() !== '') {
      setSpam(true);
      return false;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('sending');
    try {
      // In a real project you would POST to an external service (e.g., Formspree)
      // Here we simulate a successful request with a short delay.
      await new Promise((res) => setTimeout(res, 800));
      // Example using axios (commented out as endpoint is not defined)
      // await axios.post(process.env.NEXT_PUBLIC_FORM_ENDPOINT!, form);
      setStatus('success');
      setForm(initialState);
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <section className="max-w-2xl mx-auto py-12 px-4 md:px-8" id="contact">
      <h2 className="text-3xl font-semibold text-center mb-6">Contact Me</h2>
      <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
        {/* Honeypot hidden field */}
        <div style={{ display: 'none' }} aria-hidden="true">
          <label htmlFor="_gotcha">Do not fill this out</label>
          <input type="text" name="_gotcha" id="_gotcha" value={form._gotcha} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={form.name}
            onChange={handleChange}
            className={`w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.name ? 'border-red-500' : ''}`}
            required
          />
          {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={form.email}
            onChange={handleChange}
            className={`w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.email ? 'border-red-500' : ''}`}
            required
          />
          {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
            Subject
          </label>
          <input
            type="text"
            name="subject"
            id="subject"
            value={form.subject}
            onChange={handleChange}
            className={`w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.subject ? 'border-red-500' : ''}`}
            required
          />
          {errors.subject && <p className="text-red-600 text-sm mt-1">{errors.subject}</p>}
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            name="message"
            id="message"
            rows={5}
            value={form.message}
            onChange={handleChange}
            className={`w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.message ? 'border-red-500' : ''}`}
            required
          />
          {errors.message && <p className="text-red-600 text-sm mt-1">{errors.message}</p>}
        </div>
        <button
          type="submit"
          disabled={status === 'sending'}
          className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {status === 'sending' ? 'Sending…' : 'Send Message'}
        </button>
      </form>
      {/* Toast messages */}
      {spam && (
        <div className="mt-4 text-red-600 text-center" role="alert">
          Please verify you are not a robot.
        </div>
      )}
      {status === 'success' && (
        <div className="mt-4 text-green-600 text-center" role="status">
          Your message has been sent successfully!
        </div>
      )}
      {status === 'error' && (
        <div className="mt-4 text-red-600 text-center" role="alert">
          Something went wrong. Please try again later.
        </div>
      )}
    </section>
  );
}
