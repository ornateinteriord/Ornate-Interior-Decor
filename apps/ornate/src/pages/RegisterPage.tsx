import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { getApiErrorMessage } from "@ornate/utils";
import Seo from "@/components/seo/Seo";
import { useAuth } from "@/context/AuthContext";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/account";
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await register({ name, email, phone, password });
      toast.success("Account created! Welcome to Ornate Interior Decor.");
      navigate(redirect, { replace: true });
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Could not create account"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-ornate-offwhite min-h-screen pt-10 md:pt-28 pb-16 flex items-center justify-center px-4">
      <Seo
        title="Create Account"
        description="Create your Ornate Interior Decor account with basic details to checkout and track furniture orders."
        path="/register"
        noIndex
      />

      <div className="w-full max-w-md ornate-card p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-ornate-sage mx-auto flex items-center justify-center text-ornate-moss">
            <UserPlus size={20} />
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-ornate-darkgold">
            Quick Registration
          </p>
          <h1 className="font-serif text-3xl text-ornate-charcoal">
            Create Account
          </h1>
          <p className="text-xs text-ornate-muted">
            Save delivery addresses, checkout via Razorpay, and track orders effortlessly.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-ornate-charcoal mb-1.5">
              Full Name *
            </label>
            <input
              type="text"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Aarav Rao"
              className="ornate-input"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ornate-charcoal mb-1.5">
              Email Address *
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="aarav@example.com"
              className="ornate-input"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ornate-charcoal mb-1.5">
              Phone Number *
            </label>
            <input
              type="tel"
              required
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98450 00000"
              className="ornate-input"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ornate-charcoal mb-1.5">
              Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={4}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 4 characters"
                className="ornate-input pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ornate-muted"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full ornate-btn-primary py-3 gap-2 disabled:opacity-50"
          >
            <UserPlus size={15} />
            {submitting ? "Creating Account..." : "Create Account & Continue"}
          </button>
        </form>

        <div className="text-center text-sm text-ornate-muted pt-3 border-t border-ornate-border">
          Already registered?{" "}
          <Link
            to={`/login?redirect=${encodeURIComponent(redirect)}`}
            className="text-ornate-moss font-semibold hover:underline"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
