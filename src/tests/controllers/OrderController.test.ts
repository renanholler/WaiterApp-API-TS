import { OrderController } from '../../app/controllers/order/OrderController';
import { Request, Response } from 'express';
import { OrderService } from '../../app/service/order/OrderService';


jest.mock('../../app/service/order/OrderService', () => {
  return {
    OrderService: jest.fn().mockImplementation(() => {
      return {
        create: jest.fn(),
        deleteById: jest.fn(),
        find: jest.fn(),
        updateById: jest.fn(),
      };
    }),
  };
});

describe('OrdersController', () => {
  let ordersController: OrderController;
  let orderService: OrderService;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    orderService = new OrderService(); // Mock the OrderService
    ordersController = new OrderController(orderService); // Pass the mocked service to the controller
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    };
  });

  
 /**
  * RT02
  */
  it('Verificar se o sistema rejeita pedidos com quantidade inválida.', async () => {
    // Dados de entrada inválidos
    req.body = { table: 1, products: [{product: {name: 'Pizza'}, quantity: -1}] };

    // Simulando o comportamento do serviço para esse caso
    (orderService.create as jest.Mock).mockReturnValue({})

    // Chamar o método do controlador
    await ordersController.createOrder(req as Request, res as Response);

    // Verificar se o código de status 500 foi retornado
    expect(res.status).toHaveBeenCalledWith(500);
    // Verificar se a mensagem de erro foi retornada
    expect(res.send).toHaveBeenCalledWith({message : 'Invalid quantity'});
  });

  /**
   * RT03
   */
  it('Verificar se o sistema rejeita pedidos sem produto especificado.', async () => {
    //Arrange
    req.body = { produto: "", quantidade: 1, mesa: 1};
    //Mockado para não retornar nada pois a validação será feita no controller
    (orderService.create as jest.Mock).mockReturnValue({})




  });


});