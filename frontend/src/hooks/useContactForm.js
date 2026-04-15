import { useState, useCallback } from "react";
import { sendContactMessage } from "../services/portfolioService";

const EMPTY = { name: "", email: "", message: "" };

/**
 * useContactForm
 * Manages contact form state, validation, and submission.
 * Returns form values, change handler, submit handler, and UI status.
 */
export function useContactForm() {
  const [form,    setForm]    = useState(EMPTY);
  const [sending, setSending] = useState(false);
  const [status,  setStatus]  = useState(null); // null | "success" | "error"

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setStatus("error");
      return;
    }
    setSending(true);
    setStatus(null);
    const ok = await sendContactMessage(form);
    setStatus(ok ? "success" : "error");
    if (ok) setForm(EMPTY);
    setSending(false);
  }, [form]);

  const reset = useCallback(() => {
    setForm(EMPTY);
    setStatus(null);
  }, []);

  return { form, sending, status, handleChange, handleSubmit, reset };
}