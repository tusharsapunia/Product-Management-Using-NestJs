import { MongoClient } from 'mongodb';

const client = new MongoClient(
  'mongodb+srv://tusharsapunia:password@cluster0.w8os3fl.mongodb.net/?appName=Cluster0',
);

export async function dbConnect() {
  await client.connect();

  const db = client.db('product-management');
  return db.collection('products');
}
