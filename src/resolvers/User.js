const User = {
  async posts(parent, args, { prisma }, info) {
    try {
      const posts = await prisma.post.findMany({
        where: {
          userId: +parent.id
        },
      });

      return posts;
    } catch (error) {
      return error
    }

    // return db.Posts.filter((post) => {
    //   return post.author === parent.author;
    // });
  },
  comments(parent, args, { db, prisma }) {
    return db.Comments.filter((c) => {
      return c.post === parent.id;
    });
  },
};

export default User;
