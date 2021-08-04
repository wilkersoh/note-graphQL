import { GraphQLServer, PubSub } from "graphql-yoga";
import { PrismaClient } from "@prisma/client";
import db from "./db";
import Query from "./resolvers/Query";
import Mutation from "./resolvers/Mutation";
import Subscription from "./resolvers/Subscription";
import User from "./resolvers/User";
import Post from "./resolvers/Post"
import Comment from "./resolvers/Comment";



/**

  Graphql Types
  1. String
  2. Boolean
  3. Int
  4. Float
  5. ID

*/

const prisma = new PrismaClient();

const pubsub = new PubSub();

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers: {
    Query,
    Mutation,
    Subscription,
    User,
    Post,
    Comment,
  },
  context: {
    prisma,
    pubsub,
  },
});

/**
 * it serve in localhost:4000 in default
 * Conf custom port
 */
const options = {
  port: 8000,
  endpoint: "/graphql",
  subscriptions: "/subscriptions",
  playground: "/playground",
};

// enter from http://localhost:8000/playground
// server.start(options, ({port}) => {
//   console.log("The server is start in "+port)
// })


server.start(() => {
  console.log("The server is start.");
});

