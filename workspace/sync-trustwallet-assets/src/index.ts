import { join } from 'node:path';
import process from 'node:process';

import { Eip155Erc20Sync } from './sync';

export async function sync(): Promise<void> {
  const cwd = process.cwd();

  await new Eip155Erc20Sync(
    join(cwd, 'repo/blockchains/ethereum/assets'),
    join(cwd, '../../packages/eip155/1/erc20'),
  ).sync();
  await new Eip155Erc20Sync(
    join(cwd, 'repo/blockchains/polygon/assets'),
    join(cwd, '../../packages/eip155/137/erc20'),
  ).sync();
  await new Eip155Erc20Sync(
    join(cwd, 'repo/blockchains/avalanchec/assets'),
    join(cwd, '../../packages/eip155/43114/erc20'),
  ).sync();
}

void sync();
