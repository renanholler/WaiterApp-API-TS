import { Request, Response } from 'express';
import { CategoryService } from '../../service/category/CategoryService'

export class CategoryController {

  private service;

  constructor(service : CategoryService = new CategoryService()) {
    this.service = service;
  }

  public async createCategory(req: Request, res: Response) {
    try {
      const { icon, name } = req.body;
  
      const category = await this.service.create({icon, name});


      res.status(201).json(category);
    } catch(error) {
      console.error(error);
      res.sendStatus(500);
    }
  }
  
  public async deleteCategory(req: Request, res: Response) {
    try {
      const { categoryId } = req.params;
      await this.service.deleteById(categoryId);
      res.sendStatus(204);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  }

  public async listCategories(req: Request, res: Response) {
    try {
      const categories = await this.service.find();
  
      res.json(categories);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  }

  public async listProductsByCategory(req: Request, res: Response) {
    try {
      const { categoryId } = req.params;
      const products = await this.service.listProductByCategory(categoryId);
  
      res.json(products);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  }

}