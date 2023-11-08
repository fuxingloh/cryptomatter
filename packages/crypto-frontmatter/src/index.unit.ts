import { it, expect } from '@jest/globals';
import { findFrontmatterIndex, getFrontmatterImportPath, getPackageName } from './index';

import { FrontmatterIndex } from '@crypto-frontmatter/eip155-1-erc20';

it('should get FrontmatterIndex of @crypto-frontmatter/eip155-1-erc20', async () => {
  expect(FrontmatterIndex).toStrictEqual(
    expect.arrayContaining([
      expect.objectContaining({
        type: 'Frontmatter',
        path: 'eip155:1/erc20:0x00000000008943c65cAf789FFFCF953bE156f6f8',
        fields: expect.any(Object),
      }),
    ]),
  );
});

it('should get FrontmatterIndex of eip155:1/erc20:0x00000000008943c65cAf789FFFCF953bE156f6f8', async () => {
  const frontmatterIndex = findFrontmatterIndex(FrontmatterIndex, 'eip155:1/erc20:0x00000000008943c65cAf789FFFCF953bE156f6f8');
  expect(frontmatterIndex).toStrictEqual({
    fileId: '0c11e0d2cdcde5bacc14139faa96c318b6f8a0eee4a886dd914baa34e1574397',
    type: 'Frontmatter',
    path: 'eip155:1/erc20:0x00000000008943c65cAf789FFFCF953bE156f6f8',
    modifiedDate: expect.any(Number),
    sections: [],
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
          path: 'dist/Frontmatter/0c11e0d2cdcde5bacc14139faa96c318b6f8a0eee4a886dd914baa34e1574397.logo.png',
        },
      ],
    },
    headings: [],
  });
});

it('should get Frontmatter of eip155:1/erc20:0x00000000008943c65cAf789FFFCF953bE156f6f8', async () => {
  const frontmatterIndex = findFrontmatterIndex(FrontmatterIndex, 'eip155:1/erc20:0x00000000008943c65cAf789FFFCF953bE156f6f8');
  const { default: Frontmatter } = await import(getFrontmatterImportPath(frontmatterIndex!));
  expect(Frontmatter).toStrictEqual({
    ...frontmatterIndex,
    html: '<h1>Dharma USD Coin</h1>',
  });
});

it('should getPackageName eip155:1/erc20:0x00000000008943c65cAf789FFFCF953bE156f6f8', async () => {
  const packageName = getPackageName('eip155:1/erc20:0x00000000008943c65cAf789FFFCF953bE156f6f8');
  expect(packageName).toStrictEqual('@crypto-frontmatter/eip155-1-erc20');
});
