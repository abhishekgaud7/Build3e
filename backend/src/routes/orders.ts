import { Router } from 'express';
import { OrderController } from '../controllers/orders';

const router = Router();
const orderController = new OrderController();

router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrderById);
router.post('/', orderController.createOrder);
router.put('/:id/status', orderController.updateOrderStatus);

export default router;