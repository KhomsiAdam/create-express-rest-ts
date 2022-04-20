import express from 'express';

import authEndpoints from '@entities/auth/endpoints';
import adminEndpoints from '@entities/admin/endpoints';
import userEndpoints from '@entities/user/endpoints';
import projectEndpoints from '@entities/project/endpoints';
import issueEndpoints from '@entities/issue/endpoints';
import commentEndpoints from '@entities/comment/endpoints';

export const router = express.Router();

router.use('/', authEndpoints);
router.use('/admins', adminEndpoints);
router.use('/users', userEndpoints);
router.use('/projects', projectEndpoints);
router.use('/issues', issueEndpoints);
router.use('/comments', commentEndpoints);

export default router;
