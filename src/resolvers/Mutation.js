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
  createPost(parent, args, { db }, info) {
    const userExists = db.Users.some((u) => u.id === args.data.author);
    if (!userExists) throw new Error("User not found");

    const post = {
      id: uuidv4(),
      ...args.data,
    };

    db.Posts.push(post);

    return post;
  },
  deletePost(parent, args, { db }) {
    const postIndex = db.Posts.findIndex((p) => p.id === args.id);

    if (postIndex <= -1) return new Error("Post not found");

    const deletePosts = db.Posts.splice(postIndex, 1);

    db.Comments = db.Comments.filter((c) => c.post !== args.id);

    return deletePosts[0];
  },
  createComment(parent, args, { db }, info) {
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

    return comment;
  },
  deleteComment(parent, args, { db }) {
    const commentIndex = db.Comments.findIndex((c) => c.id === args.id);

    if (commentIndex === -1) return new Error("Comment not found");

    const deleteComments = db.Comments.splice(commentIndex, 1);

    return deleteComments[0];
  },
};

export default Mutation;
