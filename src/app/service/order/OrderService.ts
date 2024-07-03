
import { io } from '../../../';
import { Order } from '../../models/Order';

export class OrderService {

  public async updateById(orderId: string, status: any) {
    return await Order.findByIdAndUpdate(orderId, { status });
  }

  public async find() {
    return await Order.find()
      .sort({ createdAt: 1 })
      .populate('products.product');
  }

  public async deleteById(id: string) {
    console.log(`Tentando deletar pedido com ID: ${id}`);
    const order = await Order.findByIdAndDelete(id);
    if (order) {
      console.log(`Pedido com ID: ${id} deletado com sucesso.`);
    } else {
      console.log(`Pedido com ID: ${id} não encontrado.`);
      throw new Error('Pedido não encontrado');
    }
  }

  public async create(orderData: any) {
    const order = await Order.create(orderData);
    const orderDetails = await order.populate('products.product');
    io.emit('orders@new', orderDetails);

    return order;
  }

}
