import { Knex } from 'knex';
import { LogQuery } from '../types';

const connectionCheck = async (db: Knex): Promise<boolean> => {
  try {
    await db.raw('SELECT 1+1 as result');
    return true;
  } catch (e) {
    return false;
  }
};

const logQuery = ({ logger, query, context, logTrace }: LogQuery) => {
  const SQLQueryObj = query.toSQL();
  logger.debug({
    message: 'SQL Query',
    context,
    logTrace,
    method: SQLQueryObj.method,
    query: SQLQueryObj.sql,
    bindings: SQLQueryObj.bindings
  });
};

export { connectionCheck, logQuery };
