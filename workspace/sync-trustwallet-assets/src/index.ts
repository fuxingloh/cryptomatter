import { join } from 'node:path';
import process from 'node:process';

import { Eip155Erc20Sync } from './sync';

export async function sync(): Promise<void> {
  const cwd = process.cwd();

  await new Eip155Erc20Sync(
    join(cwd, 'repo/blockchains/ethereum/assets'),
    join(cwd, '../../packages/eip155-1-erc20/frontmatter'),
  ).sync();
  await new Eip155Erc20Sync(
    join(cwd, 'repo/blockchains/polygon/assets'),
    join(cwd, '../../packages/eip155-137-erc20/frontmatter'),
  ).sync();
  await new Eip155Erc20Sync(
    join(cwd, 'repo/blockchains/avalanchec/assets'),
    join(cwd, '../../packages/eip155-43114-erc20/frontmatter'),
  ).sync();
  await new Eip155Erc20Sync(
    join(cwd, 'repo/blockchains/smartchain/assets'),
    join(cwd, '../../packages/eip155-56-erc20/frontmatter'),
  ).sync();
  await new Eip155Erc20Sync(
    join(cwd, 'repo/blockchains/arbitrum/assets'),
    join(cwd, '../../packages/eip155-42161-erc20/frontmatter'),
  ).sync();
  await new Eip155Erc20Sync(
    join(cwd, 'repo/blockchains/optimism/assets'),
    join(cwd, '../../packages/eip155-10-erc20/frontmatter'),
  ).sync();
  await new Eip155Erc20Sync(
    join(cwd, 'repo/blockchains/aurora/assets'),
    join(cwd, '../../packages/eip155-1313161554-erc20/frontmatter'),
  ).sync();
  await new Eip155Erc20Sync(
    join(cwd, 'repo/blockchains/celo/assets'),
    join(cwd, '../../packages/eip155-42220-erc20/frontmatter'),
  ).sync();
  await new Eip155Erc20Sync(
    join(cwd, 'repo/blockchains/base/assets'),
    join(cwd, '../../packages/eip155-8453-erc20/frontmatter'),
  ).sync();

  // TODO: tron -> tip474:728126428
}

void sync();
