'use strict';

export default findRoutes;
import notes from './notes';

function findRoutes() {
  const root = notes();

  return (ctx, next) => root(ctx, next);
}
