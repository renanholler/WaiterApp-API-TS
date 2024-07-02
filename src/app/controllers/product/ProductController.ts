import { Request, Response } from 'express';
import { ProductService } from '../../service/product/ProductService';

export class ProductController {

  private service;

  constructor(service : ProductService = new ProductService()) {
    this.service = service;
  }

  public async createProduct(req: Request, res: Response) {
    try {
      const imagePath = req.file?.filename;
      const { name, description, price, category, ingredients } = req.body;

      const product = await this.service.create({
        name,
        description,
        imagePath,
        price: Number(price),
        category,
        ingredients: ingredients ? JSON.parse(ingredients) : []
      });

      res.status(201).json(product);
    } catch(error) {
      console.error(error);
      res.sendStatus(500);
    }
  }

  public async listProducts(req: Request, res: Response) {
    try {
      const products = await this.service.find();
      res.json(products);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  }



}
