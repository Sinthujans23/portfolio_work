import type { MetadataRoute } from "next";

const BASE_URL = "https://denusha.vercel.app"; // TODO: point at the production domain.

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
