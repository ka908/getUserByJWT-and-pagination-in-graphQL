const knex = require("../database.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const resolvers = {
  Query: {
    async pagination(_, { limit = 10, offset = 1 }, { user }, info) {
      try {
        console.log(typeof info.fieldName);
        const data = await knex("users")
          .select("*")
          .limit(limit)
          .offset(offset);
        // console.log(data);
        return data;
      } catch (e) {
        throw new Error(e);
      }
    },

    async getUserByJWT(_, args, { user }) {
      console.log("check double ", typeof args.id);
      console.log("check user ", user);
      console.log("check user id", typeof user.id);
      console.log(args.id == user.id);
      if (!user) {
        throw new Error("Unauthorized access: user ID is required.");
      }
      if (args.id == user.id) {
        try {
          const data = await knex("users").where({ id: user.id }).first();
          console.log(data);
          return data;
        } catch (error) {
          throw new Error(error.message);
        }
      } else {
        throw new Error("Unauthorized access: user ID does not match.");
      }
    },
    async Login(_, { input }) {
      try {
        const { email, password } = input;
        const dbData = await knex("users").where({ email: email }).first();
        if (dbData.length === 0) {
          throw new Error("No user found");
        }
        const isValidPassword = await bcrypt.compare(
          password,
          dbData["password"]
        );
        if (!isValidPassword) {
          throw new Error("Invalid password");
        }
        const token = jwt.sign({ id: dbData["id"] }, process.env.SECRET);
        return { jwt: `Bearer ${token}` };
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
  Mutation: {
    async registration(_, { input }) {
      try {
        const { name, email, password } = input;
        const hashedPassword = await bcrypt.hash(password, 10);
        const [dbData] = await knex("users")
          .insert({
            name: name,
            email: email,
            password: hashedPassword,
          })
          .returning("*");
        return dbData;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
};

module.exports = resolvers;
