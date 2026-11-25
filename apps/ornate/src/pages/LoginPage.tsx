import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Lock, LogIn } from "lucide-react";
import { toast } from "sonner";
import { getApiErrorMessage } from "@ornate/utils";
import Seo from "@/components/seo/Seo";
import { useAuth } from "@/context/AuthContext";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/account";
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
      toast.success("Welcome back to Ornate Interior Decor");
      navigate(redirect, { replace: true });
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Invalid email or password"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-ornate-offwhite min-h-screen pt-8 md:pt-28 pb-16 flex items-center justify-center px-4">
      <Seo
        title="Sign In"
        description="Sign in to your Ornate Interior Decor account to manage addresses, orders, and checkout."
        path="/login"
        noIndex
      />

      <div className="w-full max-w-md bg-white border border-ornate-gold/25 rounded-sm shadow-sm p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-11 h-11 rounded-full bg-ornate-cream border border-ornate-gold/25 mx-auto flex items-center justify-center text-ornate-darkgold">
            <Lock size={20} />
          </div>
          <p className="ornate-subtitle">Customer Account</p>
          <h1 className="font-serif text-3xl text-ornate-charcoal">Sign In</h1>
          {redirect === "/checkout" && (
            <p className="text-xs bg-ornate-cream/80 border border-ornate-gold/25 px-3 py-2 rounded-sm text-ornate-charcoal">
              Login is required to proceed to checkout. Your cart items will stay intact.
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-display text-xs uppercase tracking-wider text-ornate-charcoal/80 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3.5 py-2.5 border border-ornate-gold/30 rounded-sm bg-ornate-offwhite text-sm"
            />
          </div>

          <div>
            <label className="block font-display text-xs uppercase tracking-wider text-ornate-charcoal/80 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-3.5 py-2.5 pr-10 border border-ornate-gold/30 rounded-sm bg-ornate-offwhite text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ornate-charcoal/55"
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
            <LogIn size={15} />
            {submitting ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="text-center text-sm text-ornate-charcoal/75 pt-2 border-t border-ornate-gold/15">
          New to Ornate Studio?{" "}
          <Link
            to={`/register?redirect=${encodeURIComponent(redirect)}`}
            className="text-ornate-darkgold font-semibold hover:underline"
          >
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
