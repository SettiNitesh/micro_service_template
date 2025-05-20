import 'knex';
import { PaginateOptions, PaginatedResult } from './pagination.types';

declare module 'knex' {
  namespace Knex {
    interface QueryBuilder {
      paginate<T>(options: PaginateOptions): Promise<PaginatedResult<T>>;
    }
  }
}

// Also make sure your FastifyInstance knows about the knex decoration
