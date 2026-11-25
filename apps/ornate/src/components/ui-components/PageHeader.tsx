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
    <section className="pt-28 pb-12 md:pt-32 md:pb-14 bg-ornate-cream/65 border-b border-ornate-gold/20">
      <div className="ornate-container">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-[11px] font-display uppercase tracking-[0.16em] text-ornate-charcoal/65">
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <li key={item.path} className="flex items-center gap-2">
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
                      className="text-ornate-charcoal font-medium"
                    >
                      {item.name}
                    </span>
                  ) : (
                    <Link
                      to={item.path}
                      className="hover:text-ornate-darkgold transition-colors"
                    >
                      {item.name}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-3">
              <span className="h-px w-8 bg-ornate-darkgold" aria-hidden="true" />
              <p className="ornate-subtitle">{subtitle}</p>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-medium tracking-tight text-ornate-charcoal leading-[1.12] mb-4">
              {title}
            </h1>
            <p className="text-ornate-charcoal/75 text-base md:text-lg leading-relaxed max-w-2xl">
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
