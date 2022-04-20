/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable no-console */
import 'dotenv/config';
import mongoose from 'mongoose';

import { AuthModel } from '@entities/auth/model';
import { UserModel } from '@entities/user/model';

import users from './data/users.json';

const { DB_URI } = process.env;

const seedUsers = async () => {
  mongoose.connect(DB_URI as string, async () => {
    try {
      // Get all users by email
      const emails = users.map((user) => user.email);
      // Delete all seeded users by email
      await AuthModel.deleteMany({ email: { $in: emails } });
      await UserModel.deleteMany({ email: { $in: emails } });
      // Get all users by email and role
      const roles = users.map((user) => ({
        email: user.email,
        role: 'User',
      }));
      // Insert all users by email and role in Auth collection
      const seededRoles = await AuthModel.insertMany(roles, { ordered: false });
      // Filter users and match by email and add id to each user
      const filteredUsers = users.filter((user: any) => {
        const userMatch = seededRoles.find((role) => role.email === user.email);
        if (userMatch) {
          user.role = userMatch.id;
          return user;
        }
        return null;
      });
      // Insert all filtered users in User collection
      await UserModel.insertMany(filteredUsers, { ordered: false });
      console.log('Users seeded!');
      mongoose.disconnect();
    } catch (error) {
      console.log(error);
      mongoose.disconnect();
    }
  });
};

seedUsers();
