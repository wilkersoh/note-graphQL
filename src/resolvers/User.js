const User = {
  async posts(parent, args, { prisma }, info) {
    try {
      await prisma.post.findUnique({
        where: {
          id: +parent.author,
        },
      });
    } catch (error) {
      console.log('error :>> ', error);
    }
  },
  comments(parent, args, { db, prisma }) {
    return db.Comments.filter((c) => {
      return c.post === parent.id;
    });
  },
};

export default User;
