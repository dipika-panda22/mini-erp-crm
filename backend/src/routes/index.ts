import { asyncHandler } from '../middleware/asyncHandler';
import { Router } from 'express';
import { login } from '../controllers/auth';
import { requireAuth, allowRoles } from '../middleware/auth';
import * as customers from '../controllers/customers';
import * as products from '../controllers/products';
import * as challans from '../controllers/challans';

export const router=Router();
router.post('/auth/login',asyncHandler(login));
router.use(requireAuth);
router.get('/customers',asyncHandler(customers.listCustomers)); router.post('/customers',allowRoles('ADMIN','SALES'),asyncHandler(customers.createCustomer)); router.get('/customers/:id',asyncHandler(customers.getCustomer)); router.put('/customers/:id',allowRoles('ADMIN','SALES'),asyncHandler(customers.updateCustomer)); router.post('/customers/:id/followups',allowRoles('ADMIN','SALES'),asyncHandler(customers.addFollowup));
router.get('/products',asyncHandler(products.listProducts)); router.post('/products',allowRoles('ADMIN','WAREHOUSE'),asyncHandler(products.createProduct)); router.put('/products/:id',allowRoles('ADMIN','WAREHOUSE'),asyncHandler(products.updateProduct)); router.get('/products/:id/stock-movements',asyncHandler(products.stockMovements));
router.get('/challans',asyncHandler(challans.listChallans)); router.get('/challans/:id',asyncHandler(challans.getChallan)); router.post('/challans',allowRoles('ADMIN','SALES'),asyncHandler(challans.createChallan)); router.post('/challans/:id/confirm',allowRoles('ADMIN','SALES','WAREHOUSE'),asyncHandler(challans.confirmChallan)); router.post('/challans/:id/cancel',allowRoles('ADMIN','SALES'),asyncHandler(challans.cancelChallan));
