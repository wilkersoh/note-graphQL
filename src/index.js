import { GraphQLServer } from "graphql-yoga";
import { v4 as uuidv4 } from "uuid";

/**

  Graphql Types
  1. String
  2. Boolean
  3. Int
  4. Float
  5. ID

*/

const Users = [
  {
    id: "1",
    name: "Wilker",
    email: "wilker@gmail.com",
  },
  {
    id: "2",
    name: "laoyeche",
    email: "laoyeche@gmail.com",
    age: 12
  },
  {
    id: "3",
    name: "self",
    email: "self@gmail.com",
    age: 52
  },
];

const Posts = [
  {
    id: "10",
    title: "GraphqL 100",
    body: "",
    published: true,
    author: "1",
  },
  {
    id: "21",
    title: "GraphqL 951",
    body: "",
    published: false,
    author: "1",
  },
  {
    id: "32",
    title: "GraphqL 24",
    body: "Hey",
    published: false,
    author: "2",
  },
];

const Comments = [
  {id: "122", text: "Thanks helping", author: "2", post: "10"},
  {id: "267", text: "Going home", author: "1", post: "10"},
  {id: "641", text: "Dinner Time", author: "1", post: "32"},
];


// Type definitions (schema)
const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    comments(query: String): [Comment!]!
    me: User!
    post: Post!
  }

  type Mutation {
    createUser(data: CreateUserInput): User!
    createPost(data: CreatePostInput): Post!
    createComment(data: CreateCommentInput): Comment!
  }

  input CreateUserInput {
    name: String!
    email: String!
    age: Int
  }

  input CreatePostInput {
    title: String!
    body: String!
    published: Boolean!
    author: ID!
  }

  input CreateCommentInput {
    text: String
    author: ID!
    post: ID!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    users(parent, args, ctx, info) {
      if (!args.query) return Users;

      return Users.filter((user) => {
        return user.name.toLowerCase().includes(args.query.toLowerCase());
      });
    },
    posts(parent, args, ctx, info) {
      if (!args.query) return Posts;

      return Posts.filter((post) => {
        const isTitleMatch = post.title
          .toLowerCase()
          .includes(args.query.toLowerCase());
        const isBodyMatch = post.body
          .toLowerCase()
          .includes(args.query.toLowerCase());

        return isTitleMatch || isBodyMatch;
      });
    },
    me() {
      return {
        id: "1234",
        name: "Wilker",
        age: 21,
      };
    },
    post() {
      return {
        id: "551",
        title: "Graphql 001",
        body: "",
        published: false,
      };
    },
    comments(parent, args) {
      return Comments;
    },
  },
  Mutation: {
    createUser(parent, args, ctx, info) {
      const emailToken = Users.some(u => u.email === args.data.email)

      if(emailToken) throw new Error('Email taken.')

      const user = {
        id: uuidv4(),
        ...args.data
      }

      Users.push(user)

      return user;
    },
    createPost(parent, args, ctx, info) {
      const userExists = Users.some(u => u.id === args.data.author);
      if(!userExists) throw new Error("User not found");

      const post = {
        id: uuidv4(),
        ...args.data
      };

      Posts.push(post)

      return post;
    },
    createComment(parent, args, ctx, info) {
      const userExists = Users.some((u) => u.id === args.author);
      const isPublished = Posts.some(p => p.id === args.data.post && p.published === true)

      if (!userExists && !isPublished) throw new Error("Something going wrong");


      const comment = {
        id: uuidv4(),
        ...args.data
      }

      Comments.push(comment);

      return comment;
    }
  },
  Post: {
    author(parent, args, ctx, info) {
      return Users.find((user) => {
        return user.id === parent.author;
      });
    },
    comments(parent, args) {
      return Comments.filter((c) => {
        return c.postID === parent.id;
      });
    },
  },
  User: {
    posts(parent, args, ctx, info) {
      return Posts.filter((post) => {
        return post.author === parent.author;
      });
    },
    comments(parent, args) {
      return Comments.filter((c) => {
        return c.post === parent.id;
      });
    },
  },
  Comment: {
    author(parent, args) {
      return Users.find((user) => user.id === parent.author);
    },
    post(parent, args) {
      return Posts.find((p) => p.id === parent.post);
    },
  },
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => {
  console.log("The server is start.")
})

