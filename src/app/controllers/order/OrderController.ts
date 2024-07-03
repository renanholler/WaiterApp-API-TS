import { Request, Response } from 'express';
import { OrderService } from '../../service/order/OrderService';

export class OrderController {

  private service;

  constructor(service : OrderService = new OrderService()) {
    this.service = service;
  }

  public async createOrder(req: Request, res: Response) {
    try {
      const { table, products } = req.body;

      this.validaCreate(table, products);

      const order = await this.service.create({ table, products });

      return res.status(201).json(order);
    } catch(error : any) {
      // console.error(error);
      return res.status(500).send({message : error.message});
    }
  }

  public async cancelOrder(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      console.log(`Cancelando pedido com ID: ${orderId}`);

      await this.service.deleteById(orderId);

      console.log(`Pedido com ID: ${orderId} cancelado com sucesso.`);
      res.status(200).send({ message: 'Pedido cancelado com sucesso' });
    } catch (error) {
      const { orderId } = req.params;
      console.error(`Erro ao cancelar o pedido com ID: ${orderId}`, error);
      res.status(500).send({ message: 'Internal Server Error' });
    }
  }

  public async listOrders(req: Request, res: Response) {
    try {
      const orders = await this.service.find();
      res.json(orders);
    } catch (error) {
      // console.error(error);
      res.status(500);
    }
  }

  public async changeOrderStatus(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const { status } = req.body;

      //RT05
      if (!['WAITING', 'IN_PRODUCTION', 'DONE'].includes(status)) {
        return res.status(500).send({
          message: 'Status should be one of these: WAITING, IN_PRODUCTION, DONE'
        });
      }

      const order = await this.service.updateById(orderId, status);
      res.status(204).send(order);
    } catch(error) {
      // console.error(error);
      res.status(500);
    }
  }

  private validaCreate(table: string, products: any[]) {
    //CT02
    let invalidQtt = false;
    products.forEach(product => {
      if(product.quantity <= 0) {
        invalidQtt = true;
      }
    });

    if(invalidQtt) {
      throw new Error('Quantidade inválida');
    }

    //CT03
    let invalidName = false;
    products.forEach(product => {
      if(product.product.name == '') {
        invalidName = true;
      }
    });

    if(invalidName) {
      throw new Error('Produto inválido');
    }

    //CT13
    if(Number(table) <= 0) {
      throw new Error('Mesa inválida');
    }
  }

}
