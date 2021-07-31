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
      pubsub.publish("post", {post});
    }

    return post;
  },
  deletePost(parent, args, { db }) {
    const postIndex = db.Posts.findIndex((p) => p.id === args.id);

    if (postIndex <= -1) throw new Error("Post not found");

    const deletePosts = db.Posts.splice(postIndex, 1);

    db.Comments = db.Comments.filter((c) => c.post !== args.id);

    return deletePosts[0];
  },
  updatePost(parent, args, { db }, info) {
    const { id, data } = args;
    const post = db.Posts.find((post) => post.id === id);

    if (!post) throw new Error("Post not found");

    if (typeof data.title === "string") post.title = data.title;
    if (typeof data.body === "string") post.body = data.body;
    if (typeof data.published === "boolean") post.published = data.published;

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
    pubsub.publish(`comment ${args.data.post}`, { comment });

    return comment;
  },
  deleteComment(parent, args, { db }) {
    const commentIndex = db.Comments.findIndex((c) => c.id === args.id);

    if (commentIndex === -1) throw new Error("Comment not found");

    const deleteComments = db.Comments.splice(commentIndex, 1);

    return deleteComments[0];
  },
  updateComment(parent, args, { db }, info) {
    const { id, data } = args;
    const comment = db.Comments.find((comment) => comment.id === id);
    if (!comment) throw new Error("Comment not found");

    if (typeof data.text === "string") comment.text = data.text;

    return comment;
  },
};

export default Mutation;
