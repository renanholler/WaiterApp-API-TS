
import { Category } from '../../models/Category';
import { Product } from '../../models/Product';

export class CategoryService {


  public async listProductByCategory(categoryId: string) {
    await Product.find().where('category').equals(categoryId);
  }

  public async updateById(orderId: string, status: any) {
    return await Category.findByIdAndUpdate(orderId, { status });
  }
  
  public async find() {
    return await Category.find();
  }

  public async deleteById(id : string) {
    await Category.findByIdAndDelete(id);
  }

  public async create(category: any) {
    return await Category.create(category);
  }

}