import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  index: number;
  tone?: "light" | "dark";
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  icon,
  link,
  tone = "light",
}) => {
  const isDark = tone === "dark";

  return (
    <article
      className={`p-7 rounded-2xl border transition-all duration-200 group flex flex-col justify-between ${
        isDark
          ? "bg-white/[0.06] border-white/15 hover:bg-white/[0.11] hover:border-ornate-gold/50"
          : "bg-white border-ornate-border hover:border-ornate-moss/45 shadow-sm hover:shadow-md"
      }`}
    >
      <div>
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${
            isDark
              ? "bg-ornate-gold/15 text-ornate-gold border border-ornate-gold/25"
              : "bg-ornate-sage text-ornate-moss"
          }`}
          aria-hidden="true"
        >
          {icon}
        </div>
        <h3
          className={`font-serif text-xl mb-3 ${
            isDark ? "text-white" : "text-ornate-charcoal"
          }`}
        >
          {title}
        </h3>
        <p
          className={`mb-6 leading-relaxed text-sm ${
            isDark ? "text-white/75" : "text-ornate-muted"
          }`}
        >
          {description}
        </p>
      </div>

      <Link
        to={link}
        className={`inline-flex items-center text-sm font-semibold transition-colors ${
          isDark
            ? "text-ornate-gold hover:text-white"
            : "text-ornate-moss hover:text-ornate-darkgold"
        }`}
      >
        Explore Service
        <ArrowRight
          size={15}
          className="ml-2 transform transition-transform group-hover:translate-x-1"
          aria-hidden="true"
        />
      </Link>
    </article>
  );
};

export default ServiceCard;
