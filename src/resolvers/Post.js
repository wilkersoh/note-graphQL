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
        return error
      }
    },
    async comments(parent, args, { prisma }) {
      try {
        console.log("inside Post.js comments")
        const comments = await prisma.comment.findMany({
          where: {
            postId: parent.id
          }
        })

        return comments;
      } catch (error) {
        return error;
      }
      // return db.Comments.filter((c) => {
      //   return c.postID === parent.id;
      // });
    },
};

export default Post;
