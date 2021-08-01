import { v4 as uuidv4 } from "uuid";

const Mutation = {
  createUser(parent, args, { db }, info) {
    const emailToken = db.Users.some((u) => u.email === args.data.email);

    if (emailToken) throw new Error("Email taken.");

    const user = {
      id: uuidv4(),
      ...args.data,
    };

    db.Users.push(user);

    return user;
  },
  deleteUser(parent, args, { db }, info) {
    const userIndex = Users.findIndex((user) => {
      return user.id === args.id;
    });

    if (userIndex === -1) throw new Error("User not found");

    /**
     * @deletedUsers: [ { id: '1', name: 'Wilker', email: 'wilker@gmail.com' } ]
     */
    const deletedUsers = db.Users.splice(userIndex, 1);

    db.Posts = db.Posts.filter((post) => {
      const match = post.author === args.id;

      if (match)
        db.Comments = db.Comments.filter((comment) => comment.post !== post.id);

      return !match;
    });

    db.Comments = db.Comments.filter((comment) => comment.author !== args.id);

    return deletedUsers[0];
  },
  updateUser(parent, args, { db }, info) {
    const { id, data } = args;
    const user = db.Users.find((user) => user.id === id);
    if (!user) throw new Error("User not found");

    if (typeof data.email === "string") {
      const emailTaken = db.Users.some((user) => user.email === data.email);
      if (emailTaken) throw new Error("Email taken");

      user.email = data.email;
    }

    if (typeof data.name === "string") {
      user.name = data.name;
    }

    if (typeof data.age !== "undefined") {
      user.age = data.age;
    }

    return user;
  },
  createPost(parent, args, { db, pubsub }, info) {
    const userExists = db.Users.some((u) => u.id === args.data.author);
    if (!userExists) throw new Error("User not found");

    const post = {
      id: uuidv4(),
      ...args.data,
    };

    db.Posts.push(post);

    if (args.data.published) {
      pubsub.publish("post", {
        post: {
          mutation: "CREATED",
          data: post,
        },
      });
    }

    return post;
  },
  deletePost(parent, args, { db, pubsub }) {
    const postIndex = db.Posts.findIndex((p) => p.id === args.id);

    if (postIndex <= -1) throw new Error("Post not found");

    const [post] = db.Posts.splice(postIndex, 1);

    db.Comments = db.Comments.filter((c) => c.post !== args.id);

    if (post.published) {
      pubsub.publish("post", {
        post: {
          mutation: "DELETED",
          data: post,
        },
      });
    }

    return post;
  },
  updatePost(parent, args, { db, pubsub }, info) {
    const { id, data } = args;
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
  createComment(parent, args, { db, pubsub }, info) {
    const userExists = db.Users.some((u) => u.id === args.author);
    const isPublished = db.Posts.some(
      (p) => p.id === args.data.post && p.published === true
    );

    if (!userExists && !isPublished) throw new Error("Something going wrong");

    const comment = {
      id: uuidv4(),
      ...args.data,
    };

    db.Comments.push(comment);
    pubsub.publish(`comment ${args.data.post}`, {
      comment: {
        mutation: "CREATED",
        data: comment
      }
    });

    return comment;
  },
  deleteComment(parent, args, { db, pubsub }) {
    const commentIndex = db.Comments.findIndex((c) => c.id === args.id);

    if (commentIndex === -1) throw new Error("Comment not found");

    const [deleteComment] = db.Comments.splice(commentIndex, 1);

    pubsub.publish(`comment ${deleteComment.post}`, {
      comment: {
        mutation: "DELETED",
        data: deleteComment
      }
    })

    return deleteComment;
  },
  updateComment(parent, args, { db, pubsub }, info) {
    const { id, data } = args;
    const comment = db.Comments.find((comment) => comment.id === id);
    if (!comment) throw new Error("Comment not found");

    if (typeof data.text === "string") comment.text = data.text;

    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: "UPADTED",
        data: comment
      }
    })

    return comment;
  },
};

export default Mutation;
