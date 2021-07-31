let Users = [
  {
    id: "1",
    name: "Wilker",
    email: "wilker@gmail.com",
  },
  {
    id: "2",
    name: "laoyeche",
    email: "laoyeche@gmail.com",
    age: 12,
  },
  {
    id: "3",
    name: "self",
    email: "self@gmail.com",
    age: 52,
  },
];

let Posts = [
  {
    id: "10",
    title: "GraphqL 100",
    body: "",
    published: true,
    author: "1",
  },
  {
    id: "21",
    title: "GraphqL 951",
    body: "",
    published: true,
    author: "1",
  },
  {
    id: "32",
    title: "GraphqL 24",
    body: "Hey",
    published: false,
    author: "2",
  },
];

let Comments = [
  { id: "122", text: "Thanks helping", author: "2", post: "10" },
  { id: "267", text: "Going home", author: "1", post: "10" },
  { id: "641", text: "Dinner Time", author: "1", post: "32" },
];

const db = {
  Users,
  Posts,
  Comments
}

export { db as default};