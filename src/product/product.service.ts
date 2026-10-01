import { Injectable, NotFoundException } from '@nestjs/common';
import { dbConnect } from '../database/db.js';
import { ObjectId } from 'mongodb';
import { NetworkResources } from 'inspector/promises';

@Injectable()
export class ProductService {
  //Method to get all products:-
  async getAllProducts() {
    const collection = await dbConnect();
    const result = await collection.find().toArray();
    return result;
  }
  //Method to get a single product by id:-

  async getProductById(id: string) {
    const collection = await dbConnect();
    const result = await collection.findOne({ _id: new ObjectId(id) });
    if (!result) {
      throw new NotFoundException({ message: 'Not Found !', result: result });
    }
    return { message: 'Data Found', result: result };
  }

  //Method to create a new product

  async createNew(data: {
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    status: string;
  }) {
    const { name, description, price, stock, category, status } = { ...data };
    if (!name || !description || !price || !stock || !category || !status) {
      throw new NotFoundException({
        message: 'Enter Valid Data!',
        status: null,
      });
    }
    const collection = await dbConnect();
    const result = await collection.insertOne(data);
    return { message: 'Data Submit', result: result };
  }

  //Method for Delete Product by Id

  async deleteOne(id: string) {
    const collection = await dbConnect();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount > 0) {
      return { message: 'Product Delete', result: result };
    } else {
      throw new NotFoundException({ message: 'Not Found !', result: result });
    }
  }

  //Method for Update product all details :-

  async update(
    id: string,
    data: {
      name: string;
      description: string;
      price: number;
      stock: number;
      category: string;
      status: string;
    },
  ) {
    const { name, description, price, stock, category, status } = { ...data };
    if (!name || !description || !price || !stock || !category || !status) {
      throw new NotFoundException({
        message: 'Enter Valid Data!',
        status: null,
      });
    }
    const collection = await dbConnect();
    const result = await collection.replaceOne({ _id: new ObjectId(id) }, data);

    if (result.matchedCount === 1) {
      return { message: 'Data Update Successfully!', result: result };
    } else {
      throw new NotFoundException({
        message: 'Product Not Found',
        result: result,
      });
    }
  }

  //Method for Update
  async patchUpdate(
    id: string,
    data: Partial<{
      name: string;
      description: string;
      price: number;
      stock: number;
      category: string;
      status: string;
    }>,
  ) {
    const collection = await dbConnect();
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: data },
    );
    if (result.matchedCount === 1) {
      return { message: 'Data Update Successfully!', result: result };
    } else {
      throw new NotFoundException({
        message: 'Product Not Found',
        result: result,
      });
    }
  }
}
