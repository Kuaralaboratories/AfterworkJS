import { createPool } from "mysql2/promise"

export class MySQLAdapter {
  constructor(config) {
    this.pool = createPool(config)
  }

  async getConnection() {
    return this.pool.getConnection()
  }

  async query(sql, values) {
    const connection = await this.getConnection()
    try {
      const [results, fields] = await connection.query(sql, values)
      return [results, fields]
    } finally {
      connection.release()
    }
  }

  async createDatabase(dbName) {
    await this.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`)
  }

  async createTable(tableName, columns) {
    await this.query(
      `CREATE TABLE IF NOT EXISTS \`${tableName}\` (${columns});`
    )
  }

  async insert(tableName, data) {
    const keys = Object.keys(data)
      .map(key => `\`${key}\``)
      .join(", ")
    const values = Object.values(data)
    const placeholders = values.map(() => "?").join(", ")
    const sql = `INSERT INTO \`${tableName}\` (${keys}) VALUES (${placeholders})`
    const [result] = await this.query(sql, values)
    return result
  }

  async update(tableName, data, whereClause, whereValues) {
    const updates = Object.keys(data)
      .map(key => `\`${key}\` = ?`)
      .join(", ")
    const values = [...Object.values(data), ...whereValues]
    const sql = `UPDATE \`${tableName}\` SET ${updates} WHERE ${whereClause}`
    const [result] = await this.query(sql, values)
    return result
  }

  async delete(tableName, whereClause, whereValues) {
    const sql = `DELETE FROM \`${tableName}\` WHERE ${whereClause}`
    const [result] = await this.query(sql, whereValues)
    return result
  }

  async dropTable(tableName) {
    await this.query(`DROP TABLE IF EXISTS \`${tableName}\`;`)
  }

  async select(tableName, columns = "*", whereClause, whereValues) {
    const sql = `SELECT ${columns} FROM \`${tableName}\` ${
      whereClause ? `WHERE ${whereClause}` : ""
    }`
    const [results] = await this.query(sql, whereValues)
    return results
  }
}