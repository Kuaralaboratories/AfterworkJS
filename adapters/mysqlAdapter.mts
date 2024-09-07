import { createPool, Pool, PoolOptions, ResultSetHeader, FieldPacket } from 'mysql2/promise';

class MySQLAdapter {
    private pool: Pool;

    constructor(config: PoolOptions) {
        this.pool = createPool(config);  
    }

    private async getConnection() {
        return this.pool.getConnection();
    }

    public async query(sql: string, values?: any[]): Promise<[any, FieldPacket[]]> {
        const connection = await this.getConnection();
        try {
            const [results, fields] = await connection.query(sql, values);
            return [results, fields];
        } finally {
            connection.release();
        }
    }

    public async createDatabase(dbName: string): Promise<void> {
        await this.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    }

    public async createTable(tableName: string, columns: string): Promise<void> {
        await this.query(`CREATE TABLE IF NOT EXISTS \`${tableName}\` (${columns});`);
    }

    public async insert(tableName: string, data: Record<string, any>): Promise<ResultSetHeader> {
        const keys = Object.keys(data).map(key => `\`${key}\``).join(', ');
        const values = Object.values(data);
        const placeholders = values.map(() => '?').join(', ');
        const sql = `INSERT INTO \`${tableName}\` (${keys}) VALUES (${placeholders})`;
        const [result] = await this.query(sql, values);
        return result as ResultSetHeader;
    }

    public async update(tableName: string, data: Record<string, any>, whereClause: string, whereValues: any[]): Promise<ResultSetHeader> {
        const updates = Object.keys(data).map(key => `\`${key}\` = ?`).join(', ');
        const values = [...Object.values(data), ...whereValues];
        const sql = `UPDATE \`${tableName}\` SET ${updates} WHERE ${whereClause}`;
        const [result] = await this.query(sql, values);
        return result as ResultSetHeader;
    }

    public async delete(tableName: string, whereClause: string, whereValues: any[]): Promise<ResultSetHeader> {
        const sql = `DELETE FROM \`${tableName}\` WHERE ${whereClause}`;
        const [result] = await this.query(sql, whereValues);
        return result as ResultSetHeader;
    }

    public async dropTable(tableName: string): Promise<void> {
        await this.query(`DROP TABLE IF EXISTS \`${tableName}\`;`);
    }

    public async select(tableName: string, columns: string = '*', whereClause?: string, whereValues?: any[]): Promise<any[]> {
        const sql = `SELECT ${columns} FROM \`${tableName}\` ${whereClause ? `WHERE ${whereClause}` : ''}`;
        const [results] = await this.query(sql, whereValues);
        return results as any[];
    }
}

export { MySQLAdapter };