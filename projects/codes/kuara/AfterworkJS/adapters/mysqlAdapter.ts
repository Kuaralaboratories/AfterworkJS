import mysql, { Pool } from 'mysql2/promise';

interface MySQLConfig {
  host: string;
  user: string;
  password: string;
  database: string;
}

class MySQLAdapter {
  private pool: Pool;

  constructor(config: MySQLConfig) {
    this.pool = mysql.createPool(config);
  }

  private async query(sql: string, params: any[]) {
    const [rows] = await this.pool.query(sql, params);
    return rows;
  }

  async findOne(table: string, query: object) {
    const sql = `SELECT * FROM ${table} WHERE ${Object.keys(query).map((k) => `${k} = ?`).join(' AND ')} LIMIT 1`;
    const values = Object.values(query);
    const result = await this.query(sql, values);
    return result[0];
  }

  async insertOne(table: string, document: object) {
    const columns = Object.keys(document).join(', ');
    const values = Object.values(document);
    const placeholders = values.map(() => '?').join(', ');
    const sql = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;
    const result = await this.query(sql, values);
    return { id: result.insertId, ...document };
  }

  async updateOne(table: string, query: object, update: object) {
    const queryKeys = Object.keys(query).map((k) => `${k} = ?`).join(' AND ');
    const updateKeys = Object.keys(update).map((k) => `${k} = ?`).join(', ');
    const sql = `UPDATE ${table} SET ${updateKeys} WHERE ${queryKeys}`;
    const values = [...Object.values(update), ...Object.values(query)];
    await this.query(sql, values);
    return { ...query, ...update };
  }

  async deleteOne(table: string, query: object) {
    const sql = `DELETE FROM ${table} WHERE ${Object.keys(query).map((k) => `${k} = ?`).join(' AND ')}`;
    const values = Object.values(query);
    const result = await this.query(sql, values);
    return result.affectedRows > 0;
  }

  async find(table: string, query: object) {
    const sql = `SELECT * FROM ${table} WHERE ${Object.keys(query).map((k) => `${k} = ?`).join(' AND ')}`;
    const values = Object.values(query);
    return this.query(sql, values);
  }
}

export { MySQLAdapter };
