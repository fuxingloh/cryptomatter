import { expect, it } from '@jest/globals';

import { getFrontmatterCollection, getFrontmatterContent, getFrontmatterIndex } from './frontmatter';

it('should getFrontmatterCollection of eip155:1/erc20', async () => {
  const collection = getFrontmatterCollection('eip155:1', 'erc20');
  expect(collection).toStrictEqual(
    expect.arrayContaining([
      expect.objectContaining({
        type: 'Frontmatter',
        path: 'eip155:1/erc20:0x00000000008943c65cAf789FFFCF953bE156f6f8',
        fields: expect.any(Object),
      }),
    ]),
  );
});

it('should getFrontmatterIndex of eip155:1/erc20:0x00000000008943c65cAf789FFFCF953bE156f6f8', async () => {
  const frontmatterIndex = getFrontmatterIndex('eip155:1/erc20:0x00000000008943c65cAf789FFFCF953bE156f6f8');
  expect(frontmatterIndex).toStrictEqual({
    fileId: '0c11e0d2cdcde5bacc14139faa96c318b6f8a0eee4a886dd914baa34e1574397',
    type: 'Frontmatter',
    path: 'eip155:1/erc20:0x00000000008943c65cAf789FFFCF953bE156f6f8',
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
          path: '0c11e0d2cdcde5bacc14139faa96c318b6f8a0eee4a886dd914baa34e1574397.logo.png',
        },
      ],
    },
  });
});

it('should getFrontmatterContent of eip155:1/erc20:0x00000000008943c65cAf789FFFCF953bE156f6f8', async () => {
  const frontmatterContent = getFrontmatterContent('eip155:1/erc20:0x00000000008943c65cAf789FFFCF953bE156f6f8');
  expect(frontmatterContent).toStrictEqual({
    fileId: '0c11e0d2cdcde5bacc14139faa96c318b6f8a0eee4a886dd914baa34e1574397',
    type: 'Frontmatter',
    path: 'eip155:1/erc20:0x00000000008943c65cAf789FFFCF953bE156f6f8',
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
          path: '0c11e0d2cdcde5bacc14139faa96c318b6f8a0eee4a886dd914baa34e1574397.logo.png',
        },
      ],
    },
    html: '<h1>Dharma USD Coin</h1>',
  });
});
