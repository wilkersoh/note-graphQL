const Post = {
    async author(parent, args, { db, prisma }, info) {
      try {
        /**
         * Not work. Need to check
         */
        // const author = await prisma.post.findUnique({
        //   where: { id: +parent.id}
        // }).author();

        const user = await prisma.user.findUnique({
          where: {
            id: +parent.userId
          },
        });

        return user;

      } catch (error) {
        console.log('error :>> ', error);
      }
    },
    comments(parent, args, { db }) {
      return db.Comments.filter((c) => {
        return c.postID === parent.id;
      });
    },
};

export default Post;
