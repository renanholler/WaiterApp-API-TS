import { Request, Response } from 'express';
import { OrderService } from '../../service/order/OrderService'

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
      console.error(error);
      return res.status(500).send({message : error.message});
    }
  }  

  public async cancelOrder(req: Request, res: Response) {
    try {
      const { orderId } = req.params;

      await this.service.deleteById(orderId);

      res.sendStatus(204);
    } catch(error) {
      console.error(error);
      res.sendStatus(500);
    }
  }

  public async listOrders(req: Request, res: Response) {
    try {
      const orders = await this.service.find();
      res.json(orders);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  }
  
  public async changeOrderStatus(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
  
      if (!['WAITING', 'IN_PRODUCTION', 'DONE'].includes(status)) {
        return res.status(400).json({
          error: 'Status should be one of these: WAITING, IN_PRODUCTION, DONE'
        });
      }
  
      await this.service.updateById(orderId, status);
      res.sendStatus(204);
    } catch(error) {
      console.error(error);
      res.sendStatus(500);
    }
  }

  private validaCreate(table: String, products: any[]) {
    //CT02
    if(Number(table) < 0) {
      throw new Error("Mesa inválida");
    }

    //CT03
    if(products.length == 0 || products[0].product.name == '') {
      throw new Error("Produto inválido");
    }
  }

}