const Post = {
    author(parent, args, { db }, info) {
      return db.Users.find((user) => {
        return user.id === parent.author;
      });
    },
    comments(parent, args, { db }) {
      return db.Comments.filter((c) => {
        return c.postID === parent.id;
      });
    },
};

export default Post;
