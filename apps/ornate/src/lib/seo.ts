export const SITE_URL = "https://ornate-interior-decor.vercel.app";
export const SITE_NAME = "Ornate Interior Decor";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export const STUDIO_INFO = {
  name: "Ornate Interior Decor",
  email: "ornateinteriord@gmail.com",
  phoneDisplay: "+91 98450 44424",
  phoneHref: "tel:+919845044424",
  streetAddress: "148/E, 17th Main Rd, SBI Staff Colony, Hosahalli Extension, Stage 1, Vijayanagar",
  city: "Bengaluru",
  state: "Karnataka",
  postalCode: "560040",
  country: "IN",
  hours: [
    "Monday - Friday: 9:00 AM - 6:00 PM",
    "Saturday: 10:00 AM - 4:00 PM",
    "Sunday: Closed",
  ],
};

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function getLocalBusinessSchema(currentUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "InteriorDesigner",
    "@id": `${SITE_URL}/#organization`,
    name: STUDIO_INFO.name,
    url: currentUrl,
    logo: `${SITE_URL}/Ornate%20Interior%20Decor%20Logo.png`,
    image: DEFAULT_OG_IMAGE,
    email: STUDIO_INFO.email,
    telephone: "+91-9845044424",
    address: {
      "@type": "PostalAddress",
      streetAddress: STUDIO_INFO.streetAddress,
      addressLocality: STUDIO_INFO.city,
      addressRegion: STUDIO_INFO.state,
      postalCode: STUDIO_INFO.postalCode,
      addressCountry: STUDIO_INFO.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 12.9692026,
      longitude: 77.5372743,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday"],
        opens: "10:00",
        closes: "16:00",
      },
    ],
    areaServed: {
      "@type": "City",
      name: "Bengaluru",
    },
  };
}

export function getBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path === "/" ? "" : item.path}`,
    })),
  };
}

