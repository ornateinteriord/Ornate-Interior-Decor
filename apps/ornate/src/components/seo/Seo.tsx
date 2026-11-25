import { useEffect } from "react";
import {
  BreadcrumbItem,
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  SITE_URL,
  getBreadcrumbSchema,
  getLocalBusinessSchema,
} from "@/lib/seo";

interface SeoProps {
  title: string;
  description: string;
  path: string;
  exactTitle?: boolean;
  noIndex?: boolean;
  breadcrumbs?: BreadcrumbItem[];
  schema?: Record<string, unknown> | Array<Record<string, unknown>>;
}

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

const Seo: React.FC<SeoProps> = ({
  title,
  description,
  path,
  exactTitle = false,
  noIndex = false,
  breadcrumbs,
  schema,
}) => {
  const fullTitle = exactTitle ? title : `${title} | ${SITE_NAME}`;
  const normalizedPath = path === "/" ? "/" : path.startsWith("/") ? path : `/${path}`;
  const canonicalUrl = `${SITE_URL}${normalizedPath === "/" ? "/" : normalizedPath}`;

  useEffect(() => {
    document.title = fullTitle;

    upsertMeta("name", "description", description);
    upsertMeta("name", "robots", noIndex ? "noindex, nofollow" : "index, follow");
    upsertLink("canonical", canonicalUrl);

    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", canonicalUrl);
    upsertMeta("property", "og:image", DEFAULT_OG_IMAGE);
    upsertMeta("property", "og:type", "website");

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", fullTitle);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", DEFAULT_OG_IMAGE);

    const schemas: Array<Record<string, unknown>> = [getLocalBusinessSchema(canonicalUrl)];
    if (breadcrumbs && breadcrumbs.length > 0) {
      schemas.push(getBreadcrumbSchema(breadcrumbs));
    }
    if (schema) {
      if (Array.isArray(schema)) {
        schemas.push(...schema);
      } else {
        schemas.push(schema);
      }
    }

    let script = document.head.querySelector<HTMLScriptElement>(
      'script[type="application/ld+json"][data-ornate-seo="true"]'
    );
    if (!script) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-ornate-seo", "true");
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schemas);
  }, [fullTitle, description, canonicalUrl, noIndex, breadcrumbs, schema]);

  return null;
};

export default Seo;

