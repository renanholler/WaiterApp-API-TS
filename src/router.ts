import { Router } from 'express';
import multer from 'multer';
import path from 'node:path';

import AuthController from './app/controllers/auth/AuthController';
import { CategoryController } from './app/controllers/category/CategoryController';
import { OrderController } from './app/controllers/order/OrderController';
import { ProductController } from './app/controllers/product/ProductController';
import authMiddleware from './app/middlewares/authMiddleware';

const router = Router();
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, callback) {
      callback(null, path.resolve(__dirname, '..', 'uploads'));
    },
    filename(req, file, callback) {
      callback(null, `${Date.now()}-${file.originalname}`);
    },
  }),
});

const productController = new ProductController();
const categoryController = new CategoryController();
const orderController = new OrderController();

router.post('/login', AuthController.login);

// List products
router.get('/products', authMiddleware, productController.listProducts.bind(productController));

// Create product
router.post('/products', authMiddleware, upload.single('image'), productController.createProduct.bind(productController));

// List categories
router.get('/categories', authMiddleware, categoryController.listCategories.bind(categoryController));

// Create category
router.post('/categories', authMiddleware, categoryController.createCategory.bind(categoryController));

// Delete category
router.delete('/categories/:categoryId', authMiddleware, categoryController.deleteCategory.bind(categoryController));

// Get products by category
router.get('/categories/:categoryId/products', authMiddleware, categoryController.listProductsByCategory.bind(categoryController));

// List orders
router.get('/orders', authMiddleware, orderController.listOrders.bind(orderController));

// Create order
router.post('/orders', authMiddleware, orderController.createOrder.bind(orderController));

// Change order status
router.patch('/orders/:orderId', authMiddleware, orderController.changeOrderStatus.bind(orderController));

// Delete/Cancel order
router.delete('/orders/:orderId', authMiddleware, orderController.cancelOrder.bind(orderController));

export default router;
