import { Router } from 'express';
import { AdminBusinessCategoryController } from '../../controllers/admin/AdminBusinessCategoryController';
import { RoleBasedAuthMiddleware } from '../../middlewares/roleBasedAuthMiddleware';

const router = Router();

router.use(RoleBasedAuthMiddleware.requireAdmin() as any);

router.get('/', AdminBusinessCategoryController.list);
router.get('/:id', AdminBusinessCategoryController.findById);

export { router as categoryRoutes };