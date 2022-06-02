import 'dotenv/config';
import { connect as mongooseConnect, disconnect as mongooseDisconnect } from 'mongoose';
import { genSaltSync as bcryptGenSaltSync, hashSync as bcryptHashSync } from 'bcryptjs';

import { log } from '@services/logger.service';
import { AuthModel } from '@entities/auth/model';
import { UserModel } from '@entities/user/model';

import users from './data/users.json';

const { DB_URI } = process.env;

const seedUsers = async () => {
  mongooseConnect(DB_URI as string, async () => {
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
          const salt = bcryptGenSaltSync(12);
          user.password = bcryptHashSync(user.password, salt);
          return user;
        }
        return null;
      });
      // Insert all filtered users in User collection
      await UserModel.insertMany(filteredUsers, { ordered: false });
      log.debug('Users seeded!');
      mongooseDisconnect();
    } catch (error) {
      log.debug(error);
      mongooseDisconnect();
    }
  });
};

seedUsers();
