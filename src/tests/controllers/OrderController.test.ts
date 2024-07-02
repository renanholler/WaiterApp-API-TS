import { Request, Response } from 'express';
import { OrderController } from '../../app/controllers/order/OrderController';
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
    (orderService.create as jest.Mock).mockReturnValue({});

    // Chamar o método do controlador
    await ordersController.createOrder(req as Request, res as Response);

    // Verificar se o código de status 500 foi retornado
    expect(res.status).toHaveBeenCalledWith(500);
    // Verificar se a mensagem de erro foi retornada
    expect(res.send).toHaveBeenCalledWith({message : 'Quantidade inválida'});
  });

  /**
   * RT03
   */
  it('Verificar se o sistema rejeita pedidos sem produto especificado.', async () => {
    //Arrange
    req.body = { table: 1, products: [{product: {name: ''}, quantity: 1}] };
    //Mockado para não retornar nada pois a validação será feita no controller
    (orderService.create as jest.Mock).mockReturnValue({});

    //Act
    await ordersController.createOrder(req as Request, res as Response);

    //Assert
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({message : 'Produto inválido'});
  });

  /**
   * RT05
   */
  it('Verificar se o sistema rejeita status não existente.', async () => {
    //Arrange
    req.body = { status: 'ORDER2' };
    req.params = { orderId : '1' };
    (orderService.updateById as jest.Mock).mockReturnValue({});
    //Act
    await ordersController.changeOrderStatus(req as Request, res as Response);
    //Assert
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({message : 'Status should be one of these: WAITING, IN_PRODUCTION, DONE'});
  });

  /**
   * RT07
   */
  it('Verificar o comportamento do sistema quando não há pedidos cadastrados', async () => {
    //Arrange
    (orderService.find as jest.Mock).mockReturnValue({});
    //Act
    await ordersController.listOrders(req as Request, res as Response);
    //Assert
    expect(res.json).toHaveBeenCalledWith({});
  });

  /**
   * RT10
   */
  it('Verificar se o status de um pedido pode ser alterado corretamente', async () => {
    //Arrange
    req.body = { status: 'DONE' };
    req.params = { orderId : '1' };
    const orderResponse = {id: 1, table: 1, status: 'DONE' };
    (orderService.updateById as jest.Mock).mockReturnValue(orderResponse);
    //Act
    await ordersController.changeOrderStatus(req as Request, res as Response);
    //Assert
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalledWith(orderResponse);
  })
 
  /**
   * RT12
   */
  it('Verificar se um pedido pode ser atribuido a uma mesa com valor válido', async ()=>{
    //Arrange
    req.body = { table: 1, products: [{product: {name: 'Pizza'}, quantity: 1}] };
    (orderService.create as jest.Mock).mockReturnValue({});

    //Act
    await ordersController.createOrder(req as Request, res as Response);

    //Assert
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({});
  });

  /**
   * RT13
   */
  it('Verificar se o sistema rejeita mesa inválida', async () => {
    //Arrange
    req.body = { table: -1, products: [{product: {name: 'Pizza'}, quantity: 1}] };
    (orderService.create as jest.Mock).mockReturnValue({});

    //Act
    await ordersController.createOrder(req as Request, res as Response);

    //Assert
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({message: "Mesa inválida"});
  })


});
