import { MetadataRoute } from "next";

export default function sitemap() {
  const baseUrl = "https://bazzarhub.algaray.biz.id";

  return [
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ];
}
