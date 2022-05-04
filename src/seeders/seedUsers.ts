import 'dotenv/config';
import { connect, disconnect } from 'mongoose';
import { log } from '@services/logger.service';

import { AuthModel } from '@entities/auth/model';
import { UserModel } from '@entities/user/model';
import { UserInterface } from '@entities/user/interface';

import users from './data/users.json';

const { DB_URI } = process.env;

const seedUsers = async (): Promise<void> => {
  connect(DB_URI as string, async () => {
    try {
      // Get all users by email
      const emails = users.map((user: UserInterface) => user.email);
      // Delete all seeded users by email
      await AuthModel.deleteMany({ email: { $in: emails } });
      await UserModel.deleteMany({ email: { $in: emails } });
      // Get all users by email and role
      const roles = users.map((user: UserInterface) => ({
        email: user.email,
        role: 'User',
      }));
      // Insert all users by email and role in Auth collection
      const seededRoles = await AuthModel.insertMany(roles, { ordered: false });
      // Filter users and match by email and add id to each user
      const filteredUsers = users.filter((user: UserInterface) => {
        const userMatch = seededRoles.find((role) => role.email === user.email);
        if (!userMatch) return null;
        user.role = userMatch.id;
        return user;
      });
      // Insert all filtered users in User collection
      await UserModel.insertMany(filteredUsers, { ordered: false });
      log.info('Users seeded!');
      disconnect();
    } catch (error) {
      log.error(error);
      disconnect();
    }
  });
};

seedUsers();
