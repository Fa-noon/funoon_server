import express from 'express';

const router = express;

import user from './userRoutes';

router.use('/api/v1/users', user);

module.exports = router;
