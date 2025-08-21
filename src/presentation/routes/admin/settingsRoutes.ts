import { Router } from 'express';
import { AdminEstablishmentSettingsController } from '../../controllers/admin/AdminEstablishmentSettingsController';
import { RoleBasedAuthMiddleware } from '../../middlewares/roleBasedAuthMiddleware';

const router = Router();

router.use(RoleBasedAuthMiddleware.requireAdmin() as any);

router.get('/template', AdminEstablishmentSettingsController.generateTemplate);
router.post('/', AdminEstablishmentSettingsController.create);
router.get('/:establishmentId', AdminEstablishmentSettingsController.getByEstablishment);
router.put('/:establishmentId', AdminEstablishmentSettingsController.update);
router.delete('/:establishmentId', AdminEstablishmentSettingsController.delete);

export { router as settingsRoutes };