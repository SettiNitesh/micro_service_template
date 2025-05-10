import { Audit } from "../models";
import { BaseRepository } from "../repositories/base.repository";
import { Filters, PaginatedResponse, PaginationOptions } from "../types";

export class BaseService<T extends Audit> {
  protected model: BaseRepository<T>;

  constructor(model: BaseRepository<T>) {
    this.model = model;
  }

  async getAll(
    filters: Filters = {},
    pagination: PaginationOptions = { page: 1, limit: 10 }
  ): Promise<PaginatedResponse<T>> {
    const data = await this.model.findAll(filters, pagination);

    const total = await this.model.count(filters);

    return {
      data,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit),
      },
    };
  }

  async getById(uid: string): Promise<T> {
    return this.model.findById(uid);
  }

  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  async update(uid: string, data: Partial<T>): Promise<T> {
    return this.model.update(uid, data);
  }

  async delete(uid: string): Promise<void> {
    this.model.delete(uid);
  }
}
