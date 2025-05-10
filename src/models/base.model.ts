import db from "../config/db";
import { Entity, Filters, PaginationOptions } from "../types";
import { NotFoundError } from "../utils/errors";

export class BaseModel<T extends Entity> {
  protected tableName: string;
  protected uidColumn: string;

  constructor(tableName: string, uidColumn: string) {
    this.tableName = tableName;
    this.uidColumn = uidColumn;
  }

  async findAll(
    filters: Filters = {},
    pagination: PaginationOptions = {
      page: 1,
      limit: 10,
    }
  ): Promise<T[]> {
    const query = db<T>(this.tableName);

    //Apply filters
    Object.keys(filters).forEach((key) => {
      if (filters[key] !== undefined && filters[key] !== null) {
        query.where(key, filters[key]);
      }
    });

    //Apply pagination
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;
    query.limit(limit).offset(offset);

    return (await query.select("*")) as T[];
  }

  async findById(uid: string): Promise<T> {
    const result = await db<T>(this.tableName)
      .where({ [this.uidColumn]: uid })
      .first();
    // Check if record exists
    if (!result) {
      throw new NotFoundError(`Resource with id ${uid} not found`);
    }
    return result as T;
  }

  async create(data: Partial<T>): Promise<T> {
    const [insertedId] = await db<T>(this.tableName)
      .insert(data as any)
      .returning(this.uidColumn);

    return this.findById(insertedId);
  }

  async update(uid: string, data: Partial<T>): Promise<T> {
    // Check if record exists
    await this.findById(uid);

    // Update record
    await db<T>(this.tableName)
      .where({ [this.uidColumn]: uid })
      .update({
        ...(data as any),
        updated_at: db.fn.now(),
      });

    return this.findById(uid);
  }

  async delete(uid: string): Promise<void> {
    // Check if record exists
    await this.findById(uid);

    return db<T>(this.tableName)
      .where({ [this.uidColumn]: uid })
      .del();
  }

  async count(filters: Filters = {}): Promise<number> {
    const query = db<T>(this.tableName);

    // Apply filters
    Object.keys(filters).forEach((key) => {
      if (filters[key] !== undefined && filters[key] !== null) {
        query.where(key, filters[key]);
      }
    });

    // Define the type for the count result
    interface CountResult {
      count: string | number;
    }

    const result = (await query.count(`${this.uidColumn} as count`).first()) as
      | CountResult
      | undefined;

    return result ? parseInt(result.count.toString()) : 0;
  }
}
