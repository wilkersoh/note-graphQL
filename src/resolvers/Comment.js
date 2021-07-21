const Comment = {
    author(parent, args, { db }) {
      return db.Users.find((user) => user.id === parent.author);
    },
    post(parent, args, { db }) {
      return db.Posts.find((p) => p.id === parent.post);
    },
  };

export default Comment;
