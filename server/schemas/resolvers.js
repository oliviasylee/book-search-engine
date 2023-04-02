const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    user: async (parent, { id, username }, { user }) => {
      const foundUser = await User.findOne({
        $or: [{ _id: user ? user._id : id }, { username }],
      });
      if (!foundUser) {
        throw new Error('Cannot find a user with this id!');
      }
      return foundUser;
    },
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id});
      }
      throw new AuthenticationError('You need to be logged in!');
      },
    },
  Mutation: {
    createUser: async ( parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async ( parent, { email, password }) => {
      const user = await User.findOne({ email }); 
      if (!user) {
        throw new AuthenticationError("Can't find this user");
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError('Worng password!');
      }
      const token = signToken(user);
      return { token, user };
    },
 // Save book
 // Delete a book
  },
};
module.exports = resolvers;