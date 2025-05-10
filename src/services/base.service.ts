import { BaseModel } from "../models/base.model";
import {
  Entity,
  Filters,
  PaginatedResponse,
  PaginationOptions,
} from "../types";

export class BaseService<T extends Entity> {
  protected model: BaseModel<T>;

  constructor(model: BaseModel<T>) {
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
    this.validateData(data);
    return this.model.create(data);
  }

  async update(uid: string, data: Partial<T>): Promise<T> {
    this.validateData(data, false);
    return this.model.update(uid, data);
  }

  async delete(uid: string): Promise<void> {
    this.model.delete(uid);
  }

  protected validateData(_data: Partial<T>, _isCreating: boolean = true): void {
    // This method should be overridden by child classes
    // to perform data validation specific to each service
    return;
  }
}
