import { join } from 'node:path';
import process from 'node:process';

import { Eip155Sync } from './sync';

export async function sync(): Promise<void> {
  const cwd = process.cwd();

  await new Eip155Sync(join(cwd, 'repo/blockchains/ethereum/assets'), join(cwd, '../../packages/eip155/1')).sync();
}

void sync();
