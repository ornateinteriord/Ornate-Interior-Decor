import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import type { BreadcrumbItem } from "@/lib/seo";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  description: string;
  breadcrumbs: BreadcrumbItem[];
  aside?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  description,
  breadcrumbs,
  aside,
}) => {
  return (
    <section className="pt-28 pb-9 md:pt-32 md:pb-11 bg-ornate-cream border-b border-ornate-border">
      <div className="ornate-container">
        <nav aria-label="Breadcrumb" className="mb-5">
          <ol className="inline-flex flex-wrap items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-ornate-border text-xs font-medium text-ornate-muted">
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <li key={item.path} className="flex items-center gap-1.5">
                  {index > 0 && (
                    <ChevronRight
                      size={13}
                      className="text-ornate-darkgold"
                      aria-hidden="true"
                    />
                  )}
                  {isLast ? (
                    <span
                      aria-current="page"
                      className="text-ornate-charcoal font-semibold"
                    >
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

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <span className="ornate-pill-label mb-3">{subtitle}</span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-ornate-charcoal leading-[1.1] mb-3">
              {title}
            </h1>
            <p className="text-ornate-muted text-base md:text-lg leading-relaxed max-w-2xl">
              {description}
            </p>
          </div>

          {aside ? <div className="shrink-0">{aside}</div> : null}
        </div>
      </div>
    </section>
  );
};

export default PageHeader;
