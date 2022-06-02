import { Router } from 'express';

import authEndpoints from '@entities/auth/endpoints';
import adminEndpoints from '@entities/admin/endpoints';
import userEndpoints from '@entities/user/endpoints';

const router = Router();

router.use('/', authEndpoints);
router.use('/admins', adminEndpoints);
router.use('/users', userEndpoints);

export default router;
