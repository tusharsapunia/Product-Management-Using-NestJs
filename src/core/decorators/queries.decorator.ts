import { applyDecorators, Search } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function OrderQueries() {
  return applyDecorators(
    ApiQuery({ name: 'search', type: 'string', required: false }),
    ApiQuery({ name: 'limit', type: 'string', required: false }),
    ApiQuery({ name: 'page', type: 'string', required: false }),
  );
}
