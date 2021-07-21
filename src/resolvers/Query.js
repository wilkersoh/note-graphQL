const Query = {
  users(parent, args, { db }, info) {
    if (!args.query) return db.Users;

    return db.Users.filter((user) => {
      return user.name.toLowerCase().includes(args.query.toLowerCase());
    });
  },
  posts(parent, args, { db }, info) {
    if (!args.query) return db.Posts;

    return db.Posts.filter((post) => {
      const isTitleMatch = post.title
        .toLowerCase()
        .includes(args.query.toLowerCase());
      const isBodyMatch = post.body
        .toLowerCase()
        .includes(args.query.toLowerCase());

      return isTitleMatch || isBodyMatch;
    });
  },
  me() {
    return {
      id: "1234",
      name: "Wilker",
      age: 21,
    };
  },
  post() {
    return {
      id: "551",
      title: "Graphql 001",
      body: "",
      published: false,
    };
  },
  comments(parent, args, {db}) {
    return db.Comments;
  },
};

export default Query;