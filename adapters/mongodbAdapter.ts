import { MongoClient, Db } from 'mongodb';

interface MongoDBConfig {
  dbUrl: string;
  dbName: string;
}

class MongoDBAdapter {
  private client: MongoClient;
  private db: Db | null = null;
  private dbName: string;

  constructor(config: MongoDBConfig) {
    this.client = new MongoClient(config.dbUrl);
    this.dbName = config.dbName;
  }

  private async connect() {
    if (!this.db) {
      await this.client.connect();
      this.db = this.client.db(this.dbName);
    }
  }

  async findOne(collection: string, query: object) {
    await this.connect();
    return this.db!.collection(collection).findOne(query);
  }

  async insertOne(collection: string, document: object) {
    await this.connect();
    return this.db!.collection(collection).insertOne(document);
  }

  async updateOne(collection: string, query: object, update: object) {
    await this.connect();
    return this.db!.collection(collection).updateOne(query, { $set: update });
  }

  async deleteOne(collection: string, query: object) {
    await this.connect();
    return this.db!.collection(collection).deleteOne(query);
  }

  async find(collection: string, query: object) {
    await this.connect();
    return this.db!.collection(collection).find(query).toArray();
  }
}

export { MongoDBAdapter };
