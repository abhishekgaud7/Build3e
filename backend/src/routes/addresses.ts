import { Router } from 'express';
import { AddressController } from '../controllers/addresses';

const router = Router();
const addressController = new AddressController();

router.get('/', addressController.getAddresses);
router.get('/:id', addressController.getAddressById);
router.post('/', addressController.createAddress);
router.put('/:id', addressController.updateAddress);
router.delete('/:id', addressController.deleteAddress);

export default router;