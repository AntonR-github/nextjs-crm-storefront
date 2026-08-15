export interface Category {
  id: string;
  name: string;
  slug: string;
}

export const categories: Category[] = [
  { id: "cat-clipper", name: "מכונות תספורת", slug: "clipper" },
  { id: "cat-trimmer", name: "טרימרים", slug: "trimmer" },
  { id: "cat-shaver", name: "מגלחים", slug: "shaver" },
];
