const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    // Get a single user by either their id or their username
    user: async (parent, { id, username }, { user }) => {
      const foundUser = await User.findOne({
        $or: [{ _id: user ? user._id : id }, { username }],
      });
      if (!foundUser) {
        throw new Error('Cannot find a user with this id!');
      }
      return foundUser;
    },
    // 'me' refers to the current authenticated user and by adding context to our query, we can retrieve the logged in user without specifically searching for them
    me: async (parent, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id});
      }
      throw new AuthenticationError('You need to be logged in!');
      },
    },
  Mutation: {
    // Create a user, sign a token, and send it back 
    addUser: async ( parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    // Login a user, sign a token, and send it back (to client/src/components/LoginForm.js)
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('No user with this email found!');
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError('Incorrect password!');
      }
      const token = signToken(user);
      return { token, user };
    },
    // Save a book to a user's `savedBooks` field by adding it to the set (to prevent duplicates) 
    saveBook: async (parent, { book }, context) => {
      if (context.user) {
        const updateUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: book }},
          { new: true, runValidators: true }
        )
        return updateUser;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    // Remove a book from `savedBooks`
    removeBook: async (parent, {bookId}, context) => {
      if (context.user) {
        return User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: bookId} },
          { new: true }
        );
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },
};

module.exports = resolvers;