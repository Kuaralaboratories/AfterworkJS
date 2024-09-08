import { MongoClient } from "mongodb"

export class MongoDBAdapter {
  db = null

  constructor(config) {
    this.client = new MongoClient(config.dbUrl)
    this.dbName = config.dbName
  }

  async connect() {
    if (!this.db) {
      await this.client.connect()
      this.db = this.client.db(this.dbName)
    }
  }

  async findOne(collection, query) {
    await this.connect()
    return this.db.collection(collection).findOne(query)
  }

  async insertOne(collection, document) {
    await this.connect()
    return this.db.collection(collection).insertOne(document)
  }

  async updateOne(collection, query, update) {
    await this.connect()
    return this.db.collection(collection).updateOne(query, { $set: update })
  }

  async deleteOne(collection, query) {
    await this.connect()
    return this.db.collection(collection).deleteOne(query)
  }

  async find(collection, query) {
    await this.connect()
    return this.db
      .collection(collection)
      .find(query)
      .toArray()
  }
}