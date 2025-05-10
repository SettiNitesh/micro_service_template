import { Audit } from "../models/base.model";
import { BaseRepository } from "../repositories/base.repository";
import { Filters, PaginatedResponse, PaginationOptions } from "../types";

export class BaseService<T extends Audit> {
  protected repository: BaseRepository<T>;

  constructor(repository: BaseRepository<T>) {
    this.repository = repository;
  }

  async getAll(
    filters: Filters = {},
    pagination: PaginationOptions = { page: 1, limit: 10 }
  ): Promise<PaginatedResponse<T>> {
    const data = await this.repository.findAll(filters, pagination);

    const total = await this.repository.count(filters);

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
    return this.repository.findById(uid);
  }

  async create(data: Partial<T>): Promise<T> {
    return this.repository.create(data);
  }

  async update(uid: string, data: Partial<T>): Promise<T> {
    return this.repository.update(uid, data);
  }

  async delete(uid: string): Promise<void> {
    this.repository.delete(uid);
  }
}
