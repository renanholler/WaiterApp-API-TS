
import { Order } from '../../models/Order';
import { io } from '../../../';

export class OrderService {

  public async updateById(orderId: string, status: any) {
    return await Order.findByIdAndUpdate(orderId, { status });
  }
  
  public async find() {
    return await Order.find()
      .sort({ createdAt: 1 })
      .populate('products.product');
  }

  public async deleteById(id : string) {
    await Order.findByIdAndDelete(id);
  }

  public async create(orderData: any) {
    const order = await Order.create(orderData);
    const orderDetails = await order.populate('products.product');
    io.emit('orders@new', orderDetails);
    
    return order;
  }

}