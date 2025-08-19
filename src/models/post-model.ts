export type Post = {
  id: number;
  title: string;
  content: string;
};

// Placeholder data
export const posts: Post[] = [
  {
    id: 1,
    title: "Belajar TypeScript",
    content:
      "TypeScript adalah superset dari JavaScript yang menambahkan sistem type.",
  },
  {
    id: 2,
    title: "React Hooks",
    content:
      "Hooks memungkinkan kita menggunakan state dan fitur React lainnya tanpa menulis class.",
  },
  {
    id: 3,
    title: "Functional Programming",
    content:
      "Paradigma ini menekankan penggunaan pure function dan immutability.",
  },
  {
    id: 4,
    title: "REST API vs GraphQL",
    content:
      "REST API menggunakan endpoint berdasarkan resource, sedangkan GraphQL lebih fleksibel dalam query data.",
  },
  {
    id: 5,
    title: "Tips Produktivitas",
    content:
      "Gunakan teknik Pomodoro dan atur prioritas dengan metode Eisenhower Matrix.",
  },
];
