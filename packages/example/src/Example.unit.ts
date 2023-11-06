import { expect, it } from '@jest/globals';

import { foo } from './Example';

it('should foo be "bar"', async () => {
  expect(foo).toStrictEqual('bar');
});
