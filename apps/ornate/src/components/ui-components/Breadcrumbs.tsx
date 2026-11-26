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
      className="bg-ornate-cream/80 border-b border-ornate-border py-3"
    >
      <ol className="ornate-container flex flex-wrap items-center gap-1.5 text-xs font-medium text-ornate-muted">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-1.5">
              {index > 0 && (
                <ChevronRight size={13} className="text-ornate-darkgold" aria-hidden="true" />
              )}
              {isLast ? (
                <span aria-current="page" className="text-ornate-charcoal font-semibold">
                  {item.name}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="hover:text-ornate-moss transition-colors"
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
