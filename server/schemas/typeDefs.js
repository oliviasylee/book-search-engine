const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    bookCount: Int
    savedBooks: [Book]
  }

  type Book {
    bookId: ID!
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }

  # Contains token and optional User for authentication and references the User type
  type Auth {
    token: ID!
    user: User
  }

  # me query represents the currently authenticated user and returns a User type
  type Query {
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(authors:[String], description: String, title: String, bookId: String, image: String, link: String): User
    removeBook(bookId: ID!): User
  }
`;

module.exports = typeDefs;