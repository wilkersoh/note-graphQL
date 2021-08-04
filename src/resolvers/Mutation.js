import { prisma } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const Mutation = {
  async createUser(parent, { data }, { prisma }, info) {
    const { email, name, age } = data;

    if (!email) throw new Error("Email undefined");

    const emailToken = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (emailToken) throw new Error("Email taken.");

    const user = await prisma.user.create({
      data: {
        uuid: uuidv4(),
        name,
        email,
        age,
      },
    });

    return user;
  },
  async deleteUser(parent, args, { prisma }, info) {
    try {
      const deletePosts = prisma.post.deleteMany({
        where: {
          userId: +args.id,
        },
      });
      // const deleteComments =

      const deleteUser = prisma.user.delete({
        where: {
          id: +args.id,
        },
      });

      const transaction = await prisma.$transaction([deletePosts, deleteUser]);

      // transaction[0] > {count: numberOfPost}
      return transaction[1];
    } catch (error) {
      console.log("error: ", error);
      return error;
    }

    // const userIndex = Users.findIndex((user) => {
    //   return user.id === args.id;
    // });

    // if (userIndex === -1) throw new Error("User not found");

    /**
     * @deletedUsers: [ { id: '1', name: 'Wilker', email: 'wilker@gmail.com' } ]
     */
    // const deletedUsers = db.Users.splice(userIndex, 1);

    // db.Posts = db.Posts.filter((post) => {
    //   const match = post.author === args.id;

    //   if (match)
    //     db.Comments = db.Comments.filter((comment) => comment.post !== post.id);

    //   return !match;
    // });

    // db.Comments = db.Comments.filter((comment) => comment.author !== args.id);

    // return deletedUsers[0];
  },
  async updateUser(parent, args, { prisma }, info) {
    const { name, email, age } = args.data;
    try {
      // check user
      const hasUser = await prisma.user.findUnique({
        where: {
          id: +args.id,
        },
      });

      if (!hasUser) throw new Error("User not found");

      // check email is it exist
      const hasEmail = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (hasEmail) throw new Error("Email was taken");

      const user = await prisma.user.update({
        where: {
          id: +args.id,
        },
        data: {
          ...args.data,
          // name,
          // email,
          // age
        },
      });
      return user;
    } catch (error) {
      return error;
    }
  },
  async createPost(parent, args, { prisma, pubsub }, info) {
    // const userExists = db.Users.some((u) => u.id === args.data.author);
    if (!args.data) throw new Error("Please enter data");
    const { title, body, published, author } = args.data;

    try {
      const exisitingUser = await prisma.user.findUnique({
        where: {
          id: +args.data.author,
        },
      });
      if (!exisitingUser) throw new Error("User not found");

      const post = await prisma.post.create({
        data: {
          uuid: uuidv4(),
          title,
          body,
          published,
          user: {
            connect: { id: +author },
          },
        },
      });

      if (published) {
        pubsub.publish("post", {
          post: {
            mutation: "CREATED",
            data: post,
          },
        });
      }

      return post;
    } catch (error) {
      return error
    }
  },
  async deletePost(parent, args, { prisma, pubsub }) {
    try {
      const deletePost = await prisma.post.delete({
        where: {
          id: +args.id,
        },
      });

      if (deletePost.published) {
        pubsub.publish("post", {
          post: {
            mutation: "DELETED",
            data: deletePost,
          },
        });
      }

      return deletePost;
    } catch (error) {
      return error;
    }
    // const postIndex = db.Posts.findIndex((p) => p.id === args.id);

    // if (postIndex <= -1) throw new Error("Post not found");

    // const [post] = db.Posts.splice(postIndex, 1);

    // db.Comments = db.Comments.filter((c) => c.post !== args.id);

    // if (post.published) {
    //   pubsub.publish("post", {
    //     post: {
    //       mutation: "DELETED",
    //       data: post,
    //     },
    //   });
    // }

    // return post;
  },
  async updatePost(parent, args, { prisma, db, pubsub }, info) {

    try {
      const post = await prisma.post.update({
        where: {
          id: +args.id
        },
        data: args.data
      })

      if(post.published) {

      }

      return post;
    } catch (error) {
      return error;
    }

    const post = db.Posts.find((post) => post.id === id);

    const originalPost = { ...post };

    if (!post) throw new Error("Post not found");

    if (typeof data.title === "string") post.title = data.title;
    if (typeof data.body === "string") post.body = data.body;
    if (typeof data.published === "boolean") {
      post.published = data.published;

      if (originalPost.published === true && !post.published) {
        // deleted
        /**
         * how to trigger delete in playgorund
         * 1. update published value to false
         *
         * User update published to fasle
         */
        console.log("------ Delete -----");
        pubsub.publish("post", {
          post: {
            mutation: "DELETED",
            data: originalPost, // old data
          },
        });
      } else if (!originalPost.published === false && post.published) {
        // created
        /**
         * how to trigger create in playgorund
         * 1. update published value to true
         *
         * User update published to true
         */
        console.log("------ CREATE -----");
        pubsub.publish("post", {
          post: {
            mutation: "CREATED",
            data: post, // latest data
          },
        });
      }
    } else if (post.published) {
      // updated
      /**
       * how to trigger update in playgorund
       * 1. Cannot update the published value and it must be true
       * 2. update the body
       */
      console.log("------ Update -----");
      pubsub.publish("post", {
        post: {
          mutation: "UPDATED",
          data: post,
        },
      });
    }

    return post;
  },
  async createComment(parent, args, { prisma, pubsub }, info) {
    const {text, author, post} = args.data
    try {
      const comment = await prisma.comment.create({
        data: {
          uuid: uuidv4(),
          text,
          author: {
            connect: {
              id: +author,
            },
          },
          post: {
            connect: {
              id: +post,
            },
          },
        },
      });

      pubsub.publish(`comment ${args.data.post}`, {
        comment: {
          mutation: "CREATED",
          data: comment,
        },
      });

      return comment;
    } catch (error) {
      return error;
    }

    // const userExists = db.Users.some((u) => u.id === args.author);
    // const isPublished = db.Posts.some(
    //   (p) => p.id === args.data.post && p.published === true
    // );

    // if (!userExists && !isPublished) throw new Error("Something going wrong");

    // const comment = {
    //   id: uuidv4(),
    //   ...args.data,
    // };

    // db.Comments.push(comment);
    // pubsub.publish(`comment ${args.data.post}`, {
    //   comment: {
    //     mutation: "CREATED",
    //     data: comment,
    //   },
    // });

    // return comment;
  },
  async deleteComment(parent, args, { prisma, pubsub }) {
    try {
      const deleteComment = await prisma.comment.delete({
        where: {
          id: +args.id,
        },
      });

      pubsub.publish(`comment ${deleteComment.postId}`, {
        comment: {
          mutation: "DELETED",
          data: deleteComment,
        },
      });

      return deleteComment;
    } catch (error) {
      return error;
    }
  },
  async updateComment(parent, args, { prisma, pubsub }, info) {
    try {
      const comment = await prisma.comment.update({
        where: {
          id: +args.id,
        },
        data: {
          ...args.data,
        },
      });
      pubsub.publish(`comment ${comment.postId}`, {
        comment: {
          mutation: "UPADTED",
          data: comment,
        },
      });

      return comment;

    } catch (error) {
      return error;
    }
  },
};

export default Mutation;
