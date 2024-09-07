import { Pool, QueryConfig, QueryResult } from 'pg';

interface PostgresConfig {
  user: string;
  host: string;
  database: string;
  password: string;
  port: number;
}

class PostgresAdapter {
  private pool: Pool;

  constructor(config: PostgresConfig) {
    this.pool = new Pool(config);
  }

  private async query(query: QueryConfig): Promise<any[]> {
    const res: QueryResult<any> = await this.pool.query(query);
    return res.rows;
  }

  async findOne(table: string, query: object) {
    const text = `SELECT * FROM ${table} WHERE ${Object.keys(query).map((k, i) => `${k} = $${i + 1}`).join(' AND ')} LIMIT 1`;
    const values = Object.values(query);
    const result = await this.query({ text, values });
    return result[0];
  }

  async insertOne(table: string, document: object) {
    const columns = Object.keys(document).join(', ');
    const values = Object.values(document);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
    const text = `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) RETURNING *`;
    const result = await this.query({ text, values });
    return result[0];
  }

  async updateOne(table: string, query: object, update: object) {
    const queryKeys = Object.keys(query).map((k, i) => `${k} = $${i + 1}`).join(' AND ');
    const updateKeys = Object.keys(update).map((k, i) => `${k} = $${i + 1 + Object.keys(query).length}`).join(', ');
    const text = `UPDATE ${table} SET ${updateKeys} WHERE ${queryKeys} RETURNING *`;
    const values = [...Object.values(query), ...Object.values(update)];
    const result = await this.query({ text, values });
    return result[0];
  }

  async deleteOne(table: string, query: object): Promise<boolean> {
    const text = `DELETE FROM ${table} WHERE ${Object.keys(query).map((k, i) => `${k} = $${i + 1}`).join(' AND ')}`;
    const values = Object.values(query);
    const result: QueryResult<any> = await this.pool.query({ text, values });
    return (result.rowCount !== undefined && result.rowCount !== null && result.rowCount > 0);
  }

  async find(table: string, query: object): Promise<any[]> {
    const text = `SELECT * FROM ${table} WHERE ${Object.keys(query).map((k, i) => `${k} = $${i + 1}`).join(' AND ')}`;
    const values = Object.values(query);
    return this.query({ text, values });
  }
}

export { PostgresAdapter };
