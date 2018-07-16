// Model for Application Users
// For a more generic implementation some Google specific
// fields should be renamed

import mongoose from 'mongoose';
import _ from 'lodash';

import generateSlug from '../utils/slugify';

const { Schema } = mongoose;

const mongoSchema = new Schema({
  googleId: {
    type: String,
    required: true,
    unique: true,
  },
  googleToken: {
    access_token: String,
    refresh_token: String,
    token_type: String,
    expiry_date: Number,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  displayName: String,
  avatarUrl: String,

  isGithubConnected: {
    type: Boolean,
    default: false,
  },
  githubAccessToken: {
    type: String,
  },
});

class UserClass {

  // public fields to be displayed in browser
  static publicFields() {
    return [
      'id',
      'displayName',
      'email',
      'avatarUrl',
      'slug',
      'isAdmin',
      'isGithubConnected',
    ];
  }

  static async signInOrSignUp({
    googleId, email, googleToken, displayName, avatarUrl,
  }) {
    // check if user already exists
    const user = await this.findOne({ googleId }).select(UserClass.publicFields().join(' '));

    // if a user is found
    if (user) {
      // track fields to be changed
      const modifier = {};

      if (googleToken.accessToken) {
        modifier.access_token = googleToken.accessToken;
      }

      if (googleToken.refreshToken) {
        modifier.refresh_token = googleToken.refreshToken;
      }

      // nothing to modify, note use of lodash
      if (_.isEmpty(modifier)) {
        return user;
      }

      // if required, update user
      await this.updateOne({ googleId }, { $set: modifier });

      return user;
    }

    // user not found, create a new one
    const slug = await generateSlug(this, displayName);
    const userCount = await this.find().count();

    // note first created user will be an admin
    const newUser = await this.create({
      createdAt: new Date(),
      googleId,
      email,
      googleToken,
      displayName,
      avatarUrl,
      slug,
      isAdmin: userCount == 0,
    });
    return _.pick(newUser, UserClass.publicFields()); // return public fields only
  }
}

mongoSchema.loadClass(UserClass);

const User = mongoose.model('User', mongoSchema);

export default User;
