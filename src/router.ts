import path from 'node:path';

import { Router } from 'express';
import multer from 'multer';

import { ProductController } from './app/controllers/product/ProductController';
import { CategoryController } from './app/controllers/category/CategoryController';
import { OrderController } from './app/controllers/order/OrderController';

export const router = Router();


const productController = new ProductController();
const categoryController = new CategoryController();
const orderController = new OrderController();

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, callback) {
      callback(null, path.resolve(__dirname, '..', 'uploads'));
    },
    filename(req, file, callback) {
      callback(null, `${Date.now()}-${file.originalname}`);
    },
  })
});


// List products
router.get('/products', productController.listProducts);

// Create product
router.post('/products', upload.single('image'), productController.createProduct);

// List categories
router.get('/categories', categoryController.listCategories);

// Create category
router.post('/categories', categoryController.createCategory);

// Delete category
router.delete('/categories/:categoryId', categoryController.deleteCategory);

// Get products by category
router.get('/categories/:categoryId/products', categoryController.listProductsByCategory);

// List orders
router.get('/orders', orderController.listOrders);

// Create order
router.post('/orders', orderController.createOrder);

// Change order status
router.patch('/orders/:orderId', orderController.changeOrderStatus);

// Delete/Cancel order
router.delete('/orders/:orderId', orderController.cancelOrder);
