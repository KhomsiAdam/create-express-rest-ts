import 'dotenv/config';
import { connect as mongooseConnect, disconnect as mongooseDisconnect } from 'mongoose';

import { log } from '@services/logger.service';
import { AdminModel } from '@entities/admin/model';

const { DB_URI, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

const seedAdmin = (): void => {
  mongooseConnect(DB_URI as string, async () => {
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
        log.debug('Admin created!');
        mongooseDisconnect();
      } else {
        log.debug('Admin already exists!');
        mongooseDisconnect();
      }
    } catch (error) {
      log.debug(error);
      mongooseDisconnect();
    }
  });
};

seedAdmin();
