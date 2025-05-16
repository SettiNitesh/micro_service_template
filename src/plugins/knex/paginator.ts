import { Knex } from 'knex';
import { PaginatedResult, PaginateOptions } from '../../types';

export const PAGE_SIZE = 10;
export const CURRENT_PAGE = 1;

const EXCLUDED_ATTR_FROM_COUNT = ['order', 'columns', 'limit', 'offset', 'select', 'group'];

async function paginate<T>(
  this: Knex.QueryBuilder,
  { page_size = PAGE_SIZE, current_page = CURRENT_PAGE, distinctWith }: PaginateOptions
): Promise<PaginatedResult<T>> {
  const countByQuery = this.clone();

  const page = Math.max(current_page, 1);
  const offset = (page - 1) * page_size;

  // Remove statements that will interfere with the count query
  (countByQuery as any)._statements = (countByQuery as any)._statements.filter((statement: any) => {
    return !EXCLUDED_ATTR_FROM_COUNT.includes(statement.grouping);
  });

  if (distinctWith) {
    countByQuery.countDistinct(`${distinctWith} as total`);
  } else {
    countByQuery.count('* as total');
  }

  const [counter, result_1] = await Promise.all([
    countByQuery.first(),
    this.offset(offset).limit(page_size)
  ]);

  const total = Number(counter?.total || 0);
  const totalPages = Math.ceil(total / page_size);

  return {
    data: result_1 as T[],
    meta: {
      pagination: {
        total_items: total,
        current_page: page,
        page_size,
        total_pages: totalPages
      }
    }
  };
}

export default function setupPagination(knex: Knex): void {
  knex.queryBuilder().constructor.prototype.paginate = paginate;
}
