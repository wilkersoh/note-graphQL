const Comment = {
    async author(parent, args, { prisma }) {
      const author = await prisma.user.findUnique({
        where: {
          id: parent.authorId
        }
      })

      return author;
      // return db.Users.find((user) => user.id === parent.author);
    },
    async post(parent, args, { prisma }) {
      const post = await prisma.post.findUnique({
        where: {
          id: parent.postId
        }
      })

      return post;
      // return db.Posts.find((p) => p.id === parent.post);
    },
  };

export default Comment;
