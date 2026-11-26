import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CheckCircle2, Mail, Send } from "lucide-react";
import { toast } from "sonner";
import { STUDIO_INFO } from "@/lib/seo";

interface FormState {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const initialFormState: FormState = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

const ContactForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submittedDraft, setSubmittedDraft] = useState<{
    mailtoHref: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    const productName = searchParams.get("product");
    const productSku = searchParams.get("sku");
    if (productName) {
      setFormData((prev) => ({
        ...prev,
        subject: prev.subject || "Custom Furniture & Millwork",
        message:
          prev.message ||
          `I would like to enquire about ${productName}${
            productSku ? ` (SKU: ${productSku})` : ""
          }. Please share finish options, delivery timeline, and studio availability.`,
      }));
    }
  }, [searchParams]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {};
    if (!formData.name.trim()) {
      nextErrors.name = "Please enter your full name.";
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = "Please enter a valid email address.";
    }
    if (!formData.subject) {
      nextErrors.subject = "Please select an inquiry topic.";
    }
    if (formData.message.trim().length < 10) {
      nextErrors.message = "Please include at least 10 characters about your space or inquiry.";
    }
    return nextErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const emailSubject = encodeURIComponent(
      `[Website Inquiry] ${formData.subject} - ${formData.name.trim()}`
    );
    const emailBody = encodeURIComponent(
      [
        `Name: ${formData.name.trim()}`,
        `Email: ${formData.email.trim()}`,
        `Phone: ${formData.phone.trim() || "Not provided"}`,
        `Subject: ${formData.subject}`,
        "",
        "Project Details:",
        formData.message.trim(),
      ].join("\n")
    );
    const mailtoHref = `mailto:${STUDIO_INFO.email}?subject=${emailSubject}&body=${emailBody}`;

    setSubmittedDraft({
      mailtoHref,
      name: formData.name.trim(),
    });
    toast.success("Inquiry prepared for email", {
      description: `Click "Open Email Draft" below or write directly to ${STUDIO_INFO.email}.`,
    });
    setFormData(initialFormState);
  };

  const inputClasses =
    "ornate-input";

  return (
    <div className="space-y-6">
      {submittedDraft && (
        <div
          role="status"
          aria-live="polite"
          className="bg-ornate-sage/60 border border-ornate-moss/25 rounded-2xl p-5 flex flex-col gap-3"
        >
          <div className="flex items-start gap-3">
            <CheckCircle2 className="text-ornate-moss mt-0.5 flex-shrink-0" size={20} aria-hidden="true" />
            <div>
              <p className="font-serif text-lg text-ornate-charcoal">
                Inquiry Ready, {submittedDraft.name}
              </p>
              <p className="text-sm text-ornate-charcoal/80 mt-1">
                Launch your email client below or call {STUDIO_INFO.phoneDisplay} to send your brief directly to our Bengaluru studio.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 pt-1">
            <a href={submittedDraft.mailtoHref} className="ornate-btn-primary inline-flex items-center text-xs">
              <Mail size={15} className="mr-2" aria-hidden="true" />
              Open Email Draft
            </a>
            <a href={STUDIO_INFO.phoneHref} className="ornate-btn-outline inline-flex items-center text-xs">
              Call {STUDIO_INFO.phoneDisplay}
            </a>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="contact-name"
              className="block mb-1.5 text-xs font-semibold text-ornate-charcoal"
            >
              Full Name <span className="text-ornate-darkgold">*</span>
            </label>
            <input
              type="text"
              id="contact-name"
              name="name"
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "contact-name-error" : undefined}
              className={inputClasses}
              required
            />
            {errors.name && (
              <p id="contact-name-error" className="text-xs text-red-700 mt-1.5" role="alert">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="contact-email"
              className="block mb-1.5 text-xs font-semibold text-ornate-charcoal"
            >
              Email Address <span className="text-ornate-darkgold">*</span>
            </label>
            <input
              type="email"
              id="contact-email"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "contact-email-error" : undefined}
              className={inputClasses}
              required
            />
            {errors.email && (
              <p id="contact-email-error" className="text-xs text-red-700 mt-1.5" role="alert">
                {errors.email}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="contact-phone"
              className="block mb-1.5 text-xs font-semibold text-ornate-charcoal"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="contact-phone"
              name="phone"
              autoComplete="tel"
              value={formData.phone}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>

          <div>
            <label
              htmlFor="contact-subject"
              className="block mb-1.5 text-xs font-semibold text-ornate-charcoal"
            >
              Inquiry Topic <span className="text-ornate-darkgold">*</span>
            </label>
            <select
              id="contact-subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              aria-invalid={Boolean(errors.subject)}
              aria-describedby={errors.subject ? "contact-subject-error" : undefined}
              className={inputClasses}
              required
            >
              <option value="">Select a topic</option>
              <option value="Residential Design">Residential Design</option>
              <option value="Commercial Design">Commercial Design</option>
              <option value="Space Planning">Space Planning</option>
              <option value="Custom Furniture & Millwork">Custom Furniture &amp; Millwork</option>
              <option value="General Inquiry">General Inquiry</option>
            </select>
            {errors.subject && (
              <p id="contact-subject-error" className="text-xs text-red-700 mt-1.5" role="alert">
                {errors.subject}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="contact-message"
            className="block mb-1.5 text-xs font-semibold text-ornate-charcoal"
          >
            Project Details <span className="text-ornate-darkgold">*</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={5}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "contact-message-error" : undefined}
            className={inputClasses}
            required
          />
          {errors.message && (
            <p id="contact-message-error" className="text-xs text-red-700 mt-1.5" role="alert">
              {errors.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="ornate-btn-primary inline-flex items-center group"
        >
          Prepare Inquiry
          <Send
            size={15}
            className="ml-2 group-hover:translate-x-1 transition-transform"
            aria-hidden="true"
          />
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
