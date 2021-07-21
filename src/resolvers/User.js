const User = {
  posts(parent, args, { db }, info) {
    return db.Posts.filter((post) => {
      return post.author === parent.author;
    });
  },
  comments(parent, args, { db }) {
    return db.Comments.filter((c) => {
      return c.post === parent.id;
    });
  },
};

export default User;
