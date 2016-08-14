'use strict';

export default findRoutes;
import frontend from './frontend';

function findRoutes() {
  const root = frontend();

  return (ctx, next) => root(ctx, next);
}
