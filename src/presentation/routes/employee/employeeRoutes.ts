import { Router } from 'express';
import { RoleBasedAuthMiddleware } from '../../middlewares/roleBasedAuthMiddleware';

const employeeRouter = Router();

employeeRouter.use(RoleBasedAuthMiddleware.requireEmployee() as any);
employeeRouter.use(RoleBasedAuthMiddleware.requireEmployeeReadOnly() as any);

export { employeeRouter };