
  * [Folder Location](#folder-location)
  * [Only Single endpoint](#only-single-endpoint)
  * [Types](#types)
  * [好處](#--)
  * [Flow](#flow)
  * [Basic](#basic)
  * [Pass value](#pass-value)
    + [GraphQL Gui](#graphql-gui)
  * [Array](#array)
    + [GraphQL Gui](#graphql-gui-1)
  * [Filter with query](#filter-with-query)
    + [GraphQL Gui](#graphql-gui-2)
  * [GraphQL Relation Flow](#graphql-relation-flow)
  * [Relation (get user from post (1 direction))](#relation--get-user-from-post--1-direction--)
    + [GraphQL Gui with relation](#graphql-gui-with-relation)
  * [Relation (user and post (2 direction))](#relation--user-and-post--2-direction--)

# GraphQL

Tags: Graphql, Learning

## Folder Location

```jsx
// Playgrund/graphql-basic
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

## Relation (get user from post (1 direction))

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

## Relation (user and post (2 direction))

```jsx

```
