import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

/**
 * SQLiteデータベース操作を扱うクラス。Create, Read, Update, Delete (CRUD) 操作をサポートします。
 *
 * @class swnSQLite
 */
export default class swnSQLite {
    private dbName: string;

    /**
     * 指定されたデータベース名でSQLiteDatabaseを初期化します。
     *
     * @param {string} dbName - SQLiteデータベースファイルの名前。
     * @example
     * const db = new SQLite('example.db');
     */
    constructor(dbName: string) {
        this.dbName = dbName;
    }

    /**
     * 結果を返さない単一のクエリを実行します。
     *
     * @param {string} query - 実行するSQLクエリ。
     * @param {any[]} [params=[]] - SQLクエリに渡すパラメータ。デフォルトは空の配列。
     * @example
     * db.executeQuery('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT)');
     */
    async executeQuery(query: string, params: any[] = []): Promise<void> {
        const db = await open({ filename: this.dbName, driver: sqlite3.Database });
        await db.run(query, params);
        await db.close();
    }

    /**
     * クエリを実行し、すべての行を配列のリストとして返します。
     *
     * @param {string} query - 実行するSQLクエリ。
     * @param {any[]} [params=[]] - SQLクエリに渡すパラメータ。デフォルトは空の配列。
     * @returns {Promise<any[]>} クエリで返されたすべての行のリスト。
     * @example
     * const rows = await db.fetchAll('SELECT * FROM users');
     */
    async fetchAll(query: string, params: any[] = []): Promise<any[]> {
        const db = await open({ filename: this.dbName, driver: sqlite3.Database });
        const rows = await db.all(query, params);
        await db.close();
        return rows;
    }

    /**
     * クエリを実行し、単一の行をオブジェクトとして返します。
     *
     * @param {string} query - 実行するSQLクエリ。
     * @param {any[]} [params=[]] - SQLクエリに渡すパラメータ。デフォルトは空の配列。
     * @returns {Promise<any>} クエリで返された単一の行。
     * @example
     * const row = await db.fetchOne('SELECT * FROM users WHERE id = ?', [1]);
     */
    async fetchOne(query: string, params: any[] = []): Promise<any> {
        const db = await open({ filename: this.dbName, driver: sqlite3.Database });
        const row = await db.get(query, params);
        await db.close();
        return row;
    }

    /**
     * 指定された名前と列でテーブルを作成します。
     *
     * @param {string} tableName - 作成するテーブルの名前。
     * @param {string} columns - テーブルに作成する列とそのデータ型。
     * @example
     * db.createTable('users', 'id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT');
     */
    async createTable(tableName: string, columns: string): Promise<void> {
        const query = `CREATE TABLE IF NOT EXISTS ${tableName} (${columns})`;
        await this.executeQuery(query);
    }

    /**
     * 指定されたテーブルに新しい行を挿入します。
     *
     * @param {string} tableName - 挿入するテーブルの名前。
     * @param {string} columns - 値を挿入する列。
     * @param {any[]} values - 列に挿入する値。
     * @example
     * db.insert('users', 'name, email', ['suwanohiro', 'suwanohiro@example.com']);
     */
    async insert(tableName: string, columns: string, values: any[]): Promise<void> {
        const placeholders = values.map(() => '?').join(', ');
        const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;
        await this.executeQuery(query, values);
    }

    /**
     * 条件に一致する指定されたテーブルの行を更新します。
     *
     * @param {string} tableName - 更新するテーブルの名前。
     * @param {string} setValues - 設定する列とその新しい値。
     * @param {string} condition - 行を一致させるための条件。
     * @param {any[]} params - SQLクエリに渡すパラメータ。
     * @example
     * db.update('users', 'name = ?, email = ?', 'id = ?', ['suwanohiro', 'suwanohiro@example.com', 1]);
     */
    async update(tableName: string, setValues: string, condition: string, params: any[]): Promise<void> {
        const query = `UPDATE ${tableName} SET ${setValues} WHERE ${condition}`;
        await this.executeQuery(query, params);
    }

    /**
     * 条件に一致する指定されたテーブルの行を削除します。
     *
     * @param {string} tableName - 削除するテーブルの名前。
     * @param {string} condition - 行を一致させるための条件。
     * @param {any[]} params - SQLクエリに渡すパラメータ。
     * @example
     * db.delete('users', 'id = ?', [1]);
     */
    async delete(tableName: string, condition: string, params: any[]): Promise<void> {
        const query = `DELETE FROM ${tableName} WHERE ${condition}`;
        await this.executeQuery(query, params);
    }

    /**
     * 指定されたテーブルからすべての行を選択します。
     *
     * @param {string} tableName - 選択するテーブルの名前。
     * @returns {Promise<any[]>} テーブル内のすべての行のリスト。
     * @example
     * const rows = await db.selectAll('users');
     */
    async selectAll(tableName: string): Promise<any[]> {
        const query = `SELECT * FROM ${tableName}`;
        return await this.fetchAll(query);
    }

    /**
     * 条件に一致する指定されたテーブルの行を選択します。
     *
     * @param {string} tableName - 選択するテーブルの名前。
     * @param {string} condition - 行を一致させるための条件。
     * @param {any[]} params - SQLクエリに渡すパラメータ。
     * @returns {Promise<any[]>} 条件に一致する行のリスト。
     * @example
     * const rows = await db.selectWhere('users', 'name = ?', ['suwanohiro']);
     */
    async selectWhere(tableName: string, condition: string, params: any[]): Promise<any[]> {
        const query = `SELECT * FROM ${tableName} WHERE ${condition}`;
        return await this.fetchAll(query, params);
    }

    /**
     * 指定されたテーブルからすべての行を指定された順序で選択します。
     *
     * @param {string} tableName - 選択するテーブルの名前。
     * @param {string} orderBy - 行をソートするための列と順序。
     * @returns {Promise<any[]>} 指定された順序でソートされたテーブル内のすべての行のリスト。
     * @example
     * const rows = await db.selectAllOrdered('users', 'name ASC');
     */
    async selectAllOrdered(tableName: string, orderBy: string): Promise<any[]> {
        const query = `SELECT * FROM ${tableName} ORDER BY ${orderBy}`;
        return await this.fetchAll(query);
    }
}
