import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://pasazadebufe.com",
      lastModified: new Date(),
    },
    {
      url: "https://pasazadebufe.com/tr/menu",
      lastModified: new Date(),
    },
    {
      url: "https://pasazadebufe.com/en/menu",
      lastModified: new Date(),
    },
    {
      url: "https://pasazadebufe.com/de/menu",
      lastModified: new Date(),
    },
    {
      url: "https://pasazadebufe.com/ru/menu",
      lastModified: new Date(),
    },
  ];
}