import { Router } from 'express';
import { SupportController } from '../controllers/support';

const router = Router();
const supportController = new SupportController();

router.get('/', supportController.getTickets);
router.get('/:id', supportController.getTicketById);
router.post('/', supportController.createTicket);
router.post('/:id/messages', supportController.addMessage);

export default router;