import { expect, it } from '@jest/globals';

import { getFrontmatterContent } from './content';

it('should getFrontmatterContent of eip155:1/erc20:0x00000000008943c65cAf789FFFCF953bE156f6f8', async () => {
  const frontmatterContent = await getFrontmatterContent('eip155:1/erc20:0x00000000008943c65cAf789FFFCF953bE156f6f8');
  expect(frontmatterContent).toStrictEqual({
    fileId: expect.stringMatching(/[0-f]{64}/),
    type: 'Frontmatter',
    path: 'eip155:1/erc20:0x00000000008943c65cAf789FFFCF953bE156f6f8',
    caip2: 'eip155:1',
    namespace: 'erc20',
    modifiedDate: expect.any(Number),
    fields: {
      title: 'Dharma USD Coin',
      symbol: 'dUSDC',
      decimals: 8,
      links: [
        {
          name: 'explorer',
          url: 'https://etherscan.io/token/0x00000000008943c65cAf789FFFCF953bE156f6f8',
        },
      ],
      images: [
        {
          type: 'logo',
          mine: 'image/png',
          size: {
            width: 512,
            height: 512,
          },
          path: expect.stringMatching(/[0-f]{64}\.logo\.png/),
        },
      ],
    },
    html: '<h1>Dharma USD Coin</h1>',
  });
});
