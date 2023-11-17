import { join } from 'node:path';
import process from 'node:process';

import { DefaultSync } from './sync';

export async function sync(): Promise<void> {
  const cwd = process.cwd();

  await new DefaultSync(
    join(cwd, 'repo/blockchains/ethereum/assets'),
    join(cwd, '../../packages/eip155-1/frontmatter/erc20'),
  ).sync((info) => info.type === 'ERC20');
  await new DefaultSync(
    join(cwd, 'repo/blockchains/polygon/assets'),
    join(cwd, '../../packages/eip155-137/frontmatter/erc20'),
  ).sync((info) => info.type === 'POLYGON');
  await new DefaultSync(
    join(cwd, 'repo/blockchains/avalanchec/assets'),
    join(cwd, '../../packages/eip155-43114/frontmatter/erc20'),
  ).sync((info) => info.type === 'AVALANCHE');
  await new DefaultSync(
    join(cwd, 'repo/blockchains/smartchain/assets'),
    join(cwd, '../../packages/eip155-56/frontmatter/erc20'),
  ).sync((info) => info.type === 'BEP20');
  await new DefaultSync(
    join(cwd, 'repo/blockchains/arbitrum/assets'),
    join(cwd, '../../packages/eip155-42161/frontmatter/erc20'),
  ).sync((info) => info.type === 'ARBITRUM');
  await new DefaultSync(
    join(cwd, 'repo/blockchains/optimism/assets'),
    join(cwd, '../../packages/eip155-10/frontmatter/erc20'),
  ).sync((info) => info.type === 'OPTIMISM');
  await new DefaultSync(
    join(cwd, 'repo/blockchains/aurora/assets'),
    join(cwd, '../../packages/eip155-1313161554/frontmatter/erc20'),
  ).sync((info) => info.type === 'AURORA');
  await new DefaultSync(
    join(cwd, 'repo/blockchains/celo/assets'),
    join(cwd, '../../packages/eip155-42220/frontmatter/erc20'),
  ).sync((info) => info.type === 'CELO');
  await new DefaultSync(
    join(cwd, 'repo/blockchains/base/assets'),
    join(cwd, '../../packages/eip155-8453/frontmatter/erc20'),
  ).sync((info) => info.type === 'BASE');
  await new DefaultSync(
    join(cwd, 'repo/blockchains/tron/assets'),
    join(cwd, '../../packages/tip474-728126428/frontmatter/trc10'),
  ).sync((info) => info.type === 'TRC10');
  await new DefaultSync(
    join(cwd, 'repo/blockchains/tron/assets'),
    join(cwd, '../../packages/tip474-728126428/frontmatter/trc20'),
  ).sync((info) => info.type === 'TRC20');
}

void sync();
