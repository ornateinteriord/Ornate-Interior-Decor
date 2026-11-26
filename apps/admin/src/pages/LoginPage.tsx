import React, { useState } from "react";
import { Eye, EyeOff, KeyRound, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { getApiErrorMessage } from "@ornate/utils";
import { useAdminAuth } from "@/context/AdminAuthContext";

export const LoginPage: React.FC = () => {
  const { login } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
      toast.success("Signed in to Ornate Admin Studio");
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Invalid admin credentials"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-ornate-offwhite flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-ornate-gold/30 rounded-lg shadow-lg p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-ornate-cream border border-ornate-gold/30 mx-auto flex items-center justify-center text-ornate-darkgold">
            <ShieldCheck size={24} />
          </div>
          <p className="font-display text-[11px] uppercase tracking-[0.2em] text-ornate-darkgold">
            Ornate Interior Decor
          </p>
          <h1 className="font-serif text-3xl text-ornate-charcoal">
            Admin Portal Sign In
          </h1>
          <p className="text-xs text-ornate-charcoal/70">
            Manage combined external + MongoDB products, ImageKit uploads, orders &amp; Razorpay payments.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-display uppercase tracking-wider text-ornate-charcoal/80 mb-1.5">
              Admin Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-ornate-gold/30 rounded text-sm focus:border-ornate-darkgold outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-display uppercase tracking-wider text-ornate-charcoal/80 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 pr-10 border border-ornate-gold/30 rounded text-sm focus:border-ornate-darkgold outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ornate-charcoal/50 hover:text-ornate-charcoal"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-ornate-charcoal text-white rounded font-display text-xs uppercase tracking-[0.16em] hover:bg-ornate-darkgold transition-colors disabled:opacity-50"
          >
            {submitting ? "Signing In..." : "Access Admin Studio"}
          </button>
        </form>
      </div>
    </div>
  );
};
