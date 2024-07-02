import { Product } from '../../models/Product';

export class ProductService {

  public async updateById(orderId: string, status: any) {
    return await Product.findByIdAndUpdate(orderId, { status });
  }

  public async find() {
    return await Product.find();
  }

  public async deleteById(id : string) {
    await Product.findByIdAndDelete(id);
  }

  public async create(product: any) {
    return await Product.create(product);
  }

}
