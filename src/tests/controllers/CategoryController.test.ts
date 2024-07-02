import { Request, Response } from 'express';
import { CategoryController } from '../../app/controllers/category/CategoryController';
import { CategoryService } from '../../app/service/category/CategoryService';


jest.mock('../../app/service/category/CategoryService', () => {
  return {
    CategoryService: jest.fn().mockImplementation(() => {
      return {
        listProductByCategory: jest.fn(),
        create: jest.fn(),
        deleteById: jest.fn(),
        find: jest.fn(),
        updateById: jest.fn(),
      };
    }),
  };
});



describe('OrdersController', () => {
  let categoryController: CategoryController;
  let categoryService: CategoryService;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    categoryService = new CategoryService(); 
    categoryController = new CategoryController(categoryService); 
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    };
  });

  /**
   * RT16
   */
  it('Verificar o comportamento do sistema quando não há produtos em uma categoria.', async () => {
    //Arrange
    req.params = {categoryId: '1'};
    (categoryService.listProductByCategory as jest.Mock).mockReturnValue({});
    
    //Act
    await categoryController.listProductsByCategory(req as Request, res as Response);

    //Assert
    expect(res.json).toHaveBeenCalledWith({});
  });

});