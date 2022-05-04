import 'dotenv/config';
import { connect, disconnect } from 'mongoose';
import { log } from '@services/logger.service';

import { AdminModel } from '@entities/admin/model';

const { DB_URI, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

const seedAdmin = (): void => {
  connect(DB_URI as string, async () => {
    try {
      const findAdmin = await AdminModel.findOne({ email: ADMIN_EMAIL });
      if (!findAdmin) {
        const admin = new AdminModel({
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
          firstname: 'Admin',
          lastname: 'Admin',
        });
        await admin.save();
        log.info('Admin created!');
        disconnect();
      } else {
        log.info('Admin already exists!');
        disconnect();
      }
    } catch (error) {
      log.error(error);
      disconnect();
    }
  });
};

seedAdmin();
