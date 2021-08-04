const Subscription = {
  comment: {
    async subscribe(parent, args, { prisma, db, pubsub }, info) {
      const { postId } = args;
      const post = await prisma.post.findMany({
        where: {
          id: +args.postId,
          published: true
        },
      });


      // const post = db.Posts.find(
      //   (post) => post.id === postId && post.published
      // );

      if (!post) throw new Error("Post not found");

      return pubsub.asyncIterator(`comment ${postId}`);
    },
  },
  post: {
    subscribe(parent, args, { db, pubsub }, info) {
      return pubsub.asyncIterator("post");
    },
  },
};

export default Subscription;
