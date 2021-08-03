# How to start
1. yarn install
2. yarn start
3. npx prisma studio

# Pending
1. Heroku Cloud server to store data (already setup postgres)

> package.json
- --ext [js, graphql] are add other js to watch in nodemon

- [GraphQL](#graphql)
  * [Folder Location](#folder-location)
  * [Only Single endpoint](#only-single-endpoint)
  * [Types](#types)
  * [好處](#--)
- [Query](#query)
  * [Flow](#flow)
  * [完整的resolvers and relations](#---resolvers-and-relations)
  * [Basic](#basic)
  * [Pass value](#pass-value)
    + [GraphQL Gui](#graphql-gui)
  * [Array](#array)
    + [GraphQL Gui](#graphql-gui-1)
  * [Filter with query](#filter-with-query)
    + [GraphQL Gui](#graphql-gui-2)
  * [GraphQL Relation Flow](#graphql-relation-flow)
  * [Relation (get user from post [1 direction])](#relation--get-user-from-post--1-direction--)
    + [GraphQL Gui with relation](#graphql-gui-with-relation)
- [Mutation](#mutation)
  * [Basic](#basic-1)
    + [GraphQL Gui](#graphql-gui-3)
  * [Mutation Input](#mutation-input)
    + [GraphQL Gui](#graphql-gui-4)
  * [Delete](#delete)
  * [Update](#update)
    + [GraphQL Gui](#graphql-gui-5)
- [Subscription](#subscription)
  * [Basic](#basic-2)
  * [Subscription example](#subscription-example)
    + [GraphQL Gui](#graphql-gui-6)
    + [Test](#test)

# GraphQL

Tags: Graphql, Learning

## Folder Location

```jsx
// Playgrund/note-graphQL
yarn install
yarn start
graphql playground serve in localhost:4000
```

## Only Single endpoint

```jsx
// default
http://localhost:4000
```

## Types

```jsx
/**

  Graphql Types
  1. String
  2. Boolean
  3. Int
  4. Float
  5. ID

*/
```

## 好處

mobile 和 desktop 要拿的資料 可能會不同，因為 可能 design不同 顯示資料的方式也不同 所以 如果在mobile 去 拿desktop的資料 就浪費了 因為 沒用到

# Query

## Flow

1. create type first

```jsx
const typeDefs = `
	type User {
			id
			name
	}
`;
```

1. update into Query

```jsx
const typeDefs = `
	type Query {
		users(name: String): [User!]!
	}
`;
```

1. update resolver Query

```jsx
const resolvers = {
	Query: { // 是對應 number 2 裡 Query的 fn 名
		users(parent, args, ctx, info) {

		}
	}
}
```

1. only need if the `users` in query return的 User裡 有 relation

```jsx
const typeDefs = `
	type User {
			id
			name
			posts: [Post!]!
	}
	type Post {
		id
		title
	}
`;

const resolvers = {
	Query:{},
	User: { // type User 的 User
		posts(parent, args){} // type User 下的 posts
		// parent 是指向 return 出來的 user data的 object
	}
}
```

`Tips:` 把parent 看成 指向那個 `User` 的obj 就行了，所以 parent.anotherObjectID 會是

```jsx
const user = {
	anotherObjectID: "2"
}
```

## 完整的resolvers and relations

```jsx
import Query from "./resolvers/Query";
import Mutation from "./resolvers/Mutation";
import Subscription from "./resolvers/Subscription";
import User from "./resolvers/User";
import Post from "./resolvers/Post"
import Comment from "./resolvers/Comment";

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
    db,
    pubsub,
  },
});
```

## Basic

```jsx
import { GraphQLServer } from "graphql-yoga";

const typeDefs = `
  type Query {
    id: ID!
    name: String!
    age: Int!
    employed: Boolean!
    gpa: Float
  }
`;

// Resolvers
const resolvers = {
  Query: {
    id(){
      return "12"
    },
    name() {
      return "Wilker"
    },
    age() {
      return 10
    },
    employed() {
      return true
    },
    gpa() {
      return 2.7
    }
  }
}

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => {
  console.log("The server is start.")
})
```

```jsx
// Type definitions (schema)
const typeDefs = `
  type Query {
    greeting(name: String): String!
    me: User!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }
`;

// Resolvers
const resolvers = {
  Query: {
    me() {
      return {
        id: '1234',
        name: "Wilker",
        age: 21
      }
    }
  }
}
```

## Pass value

```jsx
// Type definitions (schema)
const typeDefs = `
  type Query {
    greeting(name: String!, posiiton: String): String!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    greeting(parent, args, ctx, info) {
      return args.name;
    },
  }
}
```

### GraphQL Gui

```jsx
query {
  greeting(name: "Wilker")
}
```

## Array

```jsx

// Type definitions (schema)
const typeDefs = `
  type Query {
		add(numbers: [Float!]!): Float! // 一定要return array， 如果有號碼會是Float
    grades: [Int!]!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    grades(parent, args, ctx, info) {
			return [10, 50]
    },
		add(parent, args, ctx, info) {
      console.log('args :>> ', args.numbers);
      if(args.numbers.length === 0) return 0

      return args.numbers.reduce((total, number) => {
        return total + number;
      }, 0)
    },
  }
}
```

### GraphQL Gui

```jsx
query {
  grades
	add(numbers: [10, 50, 20.2])
}
```

## Filter with query

```jsx
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

const typeDefs = `
  type Query {
    users(query: String): [User!]!
    me: User!
    post: Post!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }
`;

// Resolvers
const resolvers = {
  Query: {
    users(parent, args, ctx, info) {
      if(!args.query) return Users;

      return Users.filter((user) => {
        return user.name.toLowerCase().includes(args.query.toLowerCase());
      })
    },
  },
};
```

### GraphQL Gui

```jsx
query {
	users(query: 'W') {
		id
		name
		age
	}
}

or

query {
	users {
		id
		name
		age
	}
}
```

## GraphQL Relation Flow

1. Query 裡的 fn 被call
2. 如果 return 的 那個 type 裡面是有 relation的， 它會run `Query: {}` 外面的 那個被return的type的 object
3. 就比如

```jsx
const typeDefs = `
  type Query {
     users(name: String): [User!]! // 最終是會return User的
  }

  type User {
     id
     name
     posts: [Post!]!
  }

	type Post {
		id
		title
	}
`;

const resolvers = {
	Query: {
		users() { // 執行後 return 出來的 每個User 會去call Query：{} 外的 User
			return Users.filter((user) => {
        return user.name.toLowerCase().includes(args.query.toLowerCase());
      })
		}
	}，
	User: { // 一定要是User 這個User 是 posts 的 type User
		posts(parent, args) {}
	}
}
```

```jsx
const typeDefs = `
  type Query {
     users(name: String): [User!]! // 最終是會return User的
  }

  type User {
     id
     name
     posts: [Post!]!
  }

	type Post {
		id
		title
	}
`;

const resolvers = {
	Query: {
		users() { // 執行後 return 出來的每個User 會去call Query：{} 外的 User 因為  posts:[Post] 是 在 type User下面
			return Users.filter((user) => {
        return user.name.toLowerCase().includes(args.query.toLowerCase());
      })
		}
	}，
	User: { // 一定要是User 這個type User 下面有 posts
		posts(parent, args, ctx, info) { // posts 是對應 posts: [Posts!]的posts
      return Posts.filter((post) => {
        return post.author === parent.id
      })
    }
	}
}
```

## Relation (get user from post [1 direction])

```jsx
// data
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
```

```jsx

const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    me: User!
    post: Post!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
  }
`;

const resolvers = {
	Query: {},
	Post: { // 這個 Post 是要 author 上面 type的 名， 意思是說 return Query裡的fn return 出來的 2 post 會run 這個 Post 2次。
		author(parent, args, ctx, info) {
      return Users.find((user) => {
        return user.id === parent.author
      })
    }
	}
}
```

### GraphQL Gui with relation

```jsx
query {
	posts {
		id
		title
		author {
			name
		}
  }
}
```

# Mutation

## Basic

`Tips:` 要先做好 Query 才能做 Mutation， 因為 在 mutation裡 我們 create relationship的時候 它也會去 run resolver `Query:{}` 外的 object function

```jsx
const typeDefs = `
	type Mutation {
    createUser(name: String!, email: String!, age: Int): User!
  }

	type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }
`
```

```jsx
const resolvers = {
	Query:{},
	Mutation: {
		createUser(parent, args, ctx, info) {

		}
	}
}
```

### GraphQL Gui

name id email 是 create 後 要return的東西

```jsx
mutation {
  createUser(name: "TesterDev", email: "testdev@gmail.com") {
	  id
		name
    email
  }
}
```

先create query先才做mutation， 因為 relation的關係 如：

```jsx
type Mutation {
    createUser(name: String!, email: String!, age: Int): User!
    createPost(title: String!, body: String!, published: Boolean!, author: ID!): Post!
}
```

```jsx
const resolvers = {
	Query:{},
	Mutation: {
		createPost(parent, args, ctx, info) {
      const userExists = Users.some(u => u.id === args.author);

      if(!userExists) throw new Error("User not found");

      const post = {
        id: uuidv4(),
        title: args.title,
        body: args.body,
        published: args.published,
        author: args.author,
      };

      Posts.push(post)

      return post;
	  }
	}
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
}
```

## Mutation Input

previous version

```jsx
type Mutation {
    createUser(name: String!, email: String!, age: Int): User!
}
```

Clean code

```jsx
const typeDefs = `
	type Mutation {
    createUser(data: CreateUserInput): User!
	}

	input CreateUserInput {
    name: String!
    email: String!
    age: Int
  }
`;
```

`注意：` 要 + data object 然後拿value的時候 是 `args.data.object`

```jsx

const resolvers = {
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
	}
}
```

### GraphQL Gui

```jsx
mutation {
  createUser(
    data: {
      name: "newFormat",
      email: "new@gmail.com",
      age :23
    }
  ) {
    id
    name
    email
    age
  }
}
```

## Delete

要注意 也需要把 relation 裡的 data delete掉

```jsx
type Mutation {
	deleteUser(id: ID!): User!
}
```

```jsx
const resolvers = {
	Mutation: {
		deleteUser(parent, args, { db }, info) {
		  const userIndex = Users.findIndex((user) => {
	      return user.id === args.id;
		  });

		  if (userIndex === -1) throw new Error("User not found");

		  /**
		   * @deletedUsers: [ { id: '1', name: 'Wilker', email: 'wilker@gmail.com' }]
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
	}
}
```

## Update

我們不要 用 `createXxxxInput` ，我們自己create 另外一個 `updateXxxxInput`

因為 有些資料 我們在 create裡 是一定要填寫的 但是 在 update 不一樣

`注意`  我們不需要 寫 relationship 的id 在 input裡， user 是不需要改這個的

```jsx
type Mutation {
	createUser(data: CreateUserInput): User!
	updateUser(id: ID!, data: UpdateUserInput!) :User!
}

input CreateUserInput {
  name: String!
  email: String!
  age: Int
}

input UpdateUserInput {
  name: String
  email: String
  age: Int
}
```

用 `typeof` 是檢查user 有沒有 更新 這個 data， 因為 有的話 就會有string or boolean 什麼的

```jsx
 const resolver = {
	Mutation: {
		updateUser(parent, args, {db}, info) {
	    const {id, data} = args;
	    const user = db.Users.find(user => user.id === id);
	    if(!user) return new Error("User not found");

	    if(typeof data.email === 'string') {
	      const emailTaken = db.Users.some(user => user.email === data.email)
	      if(emailTaken) throw new Error("Email taken");

	      user.email = data.email
	    }

	    if(typeof data.name === "string") {
	      user.name = data.name
	    }

	    if(typeof data.age !== 'undefined') {
	      user.age = data.age
	    }

	    return user;
	  },
	}
}
```

### GraphQL Gui

```jsx
mutation {
  updateUser(
    id: "1",
    data: {
      name: "Developer",
      age: 12
    }
  ) {
    id
    name
    email
    age
  }
}
```

# Subscription

## Basic

```jsx
// Subscription.js

const Subscription = {
 count: {
    subscribe(parent, args, {pubsub}, info) {
      let count = 0;

      setInterval(() => {
        count++
				/*
					publish("channel name", { value pass to client, Int type })
					這個 一個 樣本 我們其實 是放在 create的地方 去 call 這個 pubsub 然後 send data 去 client， 如果 他們的 channel name 是一樣的話 就會被triggered
				*/
        pubsub.publish('count', {
          count
        })
      }, 1000);

      // register 監視器，裡面的string 是 channel name
      return pubsub.asyncIterator('count')
    }
  }
}

export default Subscription;
```

```jsx
import { GraphQLServer, PubSub } from "graphql-yoga";
import Subscription from "./Subscription.js"

const pubsub = new PubSub();

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers: {
   Subscription,
  },
  context: {
    db,
    pubsub,
  },
});
```

subscription 裡的 count 就是 *Subscription.js* object 裡 count

下面的 type Subscription 不像 Mutation or Query 一定要是 return 一個 object Type， 他也能 return Int

```jsx
type Subscription {
  count: Int!
}
```

## Subscription example

comment 收一個 `postID` 就是說 只要 那個 post 是 match的 我們的 subscription 就會被trigger

```jsx
type Subscription {
  comment(postId: ID!): Comment!
}

type Comment {
  id: ID!
  text: String!
  author: User!
  post: Post!
}
```

```jsx
const Subscription = {
	comment: {
    subscribe(parent, args, {db, pubsub}, info) {
      const {postId} = args;
      const post = db.Posts.find(post => post.id === postId && post.published);

      if(!post) throw new Error("Post not found");
			// 在這裡 register channel name
      return pubsub.asyncIterator(`comment ${postId}`);

    }
  }
}
```

```jsx
const Mutation = {
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
		// 這個 會 去 match Subscription 的 channel name 一樣的話 就 trigger
    pubsub.publish(`comment ${args.data.post}`, { comment })

    return comment;
  },
}
```

### GraphQL Gui

```jsx
subscription {
  comment(postId: "10") {
    id
    text
    author {
      name
    }
  }
}
```

subscription 監視 `10`

當 createComment裡的 post 是 10的話 我們的 subscription就會被trigger

```jsx
mutation {
  createComment(
    data: {
      text: "Cool developer",
      author: "1",
      post: "10"
    }
  ) {
    id
    text
  }
}
```

### Test

```jsx
/**

  Goal: Create a subscription for new posts
  1. Define "post" subscription. No arguements are necessary. Response should be a post object.
  2. Setup the resolver for post. Since there are no args, a channel name like "post" is fine.
  3. Modify the mutation for creating a post to publish the new post data.
    - Only call pubsub.pubish if the post had "published" set to true.
    - Don't worry about updatePost or deletePost.
*/
```

1. Go to schema.graphql

```jsx
type Subscription {
  post: Post!
}

type Post {
  id: ID!
  title: String!
  body: String!
  published: Boolean!
  author: User!
  comments: [Comment!]!
}
```

1.

```jsx
// Subscription.js
const Subscription = {
	post: {
    subscribe(parent, args, {db, pubsub}, info) {
      return pubsub.asyncIterator('post');
    }
  }
}
```

1.

```jsx
// Mutation.js
const Mutation = {
	createPost(parent, args, { db, pubsub }, info) {
    const userExists = db.Users.some((u) => u.id === args.data.author);
    if (!userExists) throw new Error("User not found");

    const post = {
      id: uuidv4(),
      ...args.data,
    };

    db.Posts.push(post);

    // add this for subscription
    if (args.data.published) {
      pubsub.publish("post", {post});
    }

    return post;
  },
}
```

Graphql Gui

```jsx
subscription {
  post {
    id
    title
    body
    author {
      id
      name
    }
  }
}
```

