const Query = {
  async users(parent, args, { prisma }, info) {
    if (!args.query) return await prisma.user.findMany({});

    const users = await prisma.user.findMany({
      where: {
        name: {
          equals: args.query
        },
      },
    });

    return users;
  },
  async posts(parent, args, { prisma }, info) {
    if (!args.query) return await prisma.post.findMany();
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          {
            title: {
              contains: args.query,
              mode: "insensitive"
            },
          },
          {
            body: {
              contains: args.query,
              mode: "insensitive"
            }
          }
        ]
      },
    });

    return posts;
  },
  comments(parent, args, { db }) {
    return db.Comments;
  },
};

export default Query;