import { Pool } from "pg"

export class PostgresAdapter {
  constructor(config) {
    this.pool = new Pool(config)
  }

  async query(query) {
    const res = await this.pool.query(query)
    return res.rows
  }

  async findOne(table, query) {
    const text = `SELECT * FROM ${table} WHERE ${Object.keys(query)
      .map((k, i) => `${k} = $${i + 1}`)
      .join(" AND ")} LIMIT 1`
    const values = Object.values(query)
    const result = await this.query({ text, values })
    return result[0]
  }

  async insertOne(table, document) {
    const columns = Object.keys(document).join(", ")
    const values = Object.values(document)
    const placeholders = values.map((_, i) => `$${i + 1}`).join(", ")
    const text = `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) RETURNING *`
    const result = await this.query({ text, values })
    return result[0]
  }

  async updateOne(table, query, update) {
    const queryKeys = Object.keys(query)
      .map((k, i) => `${k} = $${i + 1}`)
      .join(" AND ")
    const updateKeys = Object.keys(update)
      .map((k, i) => `${k} = $${i + 1 + Object.keys(query).length}`)
      .join(", ")
    const text = `UPDATE ${table} SET ${updateKeys} WHERE ${queryKeys} RETURNING *`
    const values = [...Object.values(query), ...Object.values(update)]
    const result = await this.query({ text, values })
    return result[0]
  }

  async deleteOne(table, query) {
    const text = `DELETE FROM ${table} WHERE ${Object.keys(query)
      .map((k, i) => `${k} = $${i + 1}`)
      .join(" AND ")}`
    const values = Object.values(query)
    const result = await this.pool.query({ text, values })
    return (
      result.rowCount !== undefined &&
      result.rowCount !== null &&
      result.rowCount > 0
    )
  }

  async find(table, query) {
    const text = `SELECT * FROM ${table} WHERE ${Object.keys(query)
      .map((k, i) => `${k} = $${i + 1}`)
      .join(" AND ")}`
    const values = Object.values(query)
    return this.query({ text, values })
  }
}