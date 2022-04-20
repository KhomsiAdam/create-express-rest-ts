/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable no-console */
import 'dotenv/config';
import mongoose from 'mongoose';

import { AdminModel } from '@entities/admin/model';

const { DB_URI, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

const seedAdmin = () => {
  mongoose.connect(DB_URI as string, async () => {
    try {
      const findAdmin = await AdminModel.findOne({ email: ADMIN_EMAIL });
      if (!findAdmin) {
        // const hashed = await bcrypt.hash(ADMIN_PASSWORD as string, 12);
        const admin = new AdminModel({
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
          firstname: 'Admin',
          lastname: 'Admin',
        });
        await admin.save();
        // const registeredAdmin = new AuthModel({
        //   email: ADMIN_EMAIL,
        //   role: AdminModel.modelName,
        // });
        // await registeredAdmin.save();
        console.log('Admin created!');
        mongoose.disconnect();
      } else {
        console.log('Admin already exists!');
        mongoose.disconnect();
      }
    } catch (error) {
      console.log(error);
      mongoose.disconnect();
    }
  });
};

seedAdmin();
