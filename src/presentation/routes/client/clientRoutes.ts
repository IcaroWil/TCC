import { Router } from 'express';
import { RoleBasedAuthMiddleware } from '../../middlewares/roleBasedAuthMiddleware';

const clientRouter = Router();

clientRouter.use(RoleBasedAuthMiddleware.requireClient() as any);

export { clientRouter };