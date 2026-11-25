import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { BreadcrumbItem } from "@/lib/seo";

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className="bg-ornate-cream/80 border-b border-ornate-gold/15 py-3.5"
    >
      <ol className="ornate-container flex flex-wrap items-center gap-2 text-xs font-display uppercase tracking-wider text-ornate-charcoal/70">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-2">
              {index > 0 && (
                <ChevronRight size={14} className="text-ornate-gold" aria-hidden="true" />
              )}
              {isLast ? (
                <span aria-current="page" className="text-ornate-charcoal font-medium">
                  {item.name}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="hover:text-ornate-darkgold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ornate-gold"
                >
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;

