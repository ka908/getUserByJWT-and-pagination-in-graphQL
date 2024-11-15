const { gql } = require("apollo-server-express");
const typeDefs = gql`
  type Users {
    id: ID!
    name: String
    email: String
    password: String
  }
  input userRegistration {
    name: String!
    email: String!
    password: String!
  }
  type loginForJWT {
    jwt: String!
  }
  input userLogin {
    email: String
    password: String
  }
  input getUser {
    id: ID!
  }
  type Query {
    Login(input: userLogin!): loginForJWT
    getUserByJWT(id: ID!): Users!
    pagination(limit: Int, offset: Int): [Users!]!
  }
  type Mutation {
    registration(input: userRegistration!): Users!
  }
`;
module.exports = typeDefs;
