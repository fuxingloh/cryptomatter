import { copyFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

import { Command, Option, runExit } from 'clipanion';

import { getFrontmatterIndexArray, getInstalledFrontmatterCollection, getNodeModulesPath } from './index';

export class MirrorCommand extends Command {
  static override paths = [[`mirror`]];
  private target = Option.String();

  async execute(): Promise<number | void> {
    await mkdir(this.target, { recursive: true });

    const collections = await getInstalledFrontmatterCollection();
    for (const collection of collections) {
      let count = 0;
      const indexArray = await getFrontmatterIndexArray(collection.caip2, collection.namespace);

      for (const index of indexArray) {
        const filePath = index.fileId + '.json';
        const from = getNodeModulesPath(collection.caip2, collection.namespace, filePath);
        const to = join(this.target, filePath);
        count++;
        await copyFile(from, to);

        for (const image of index.fields.images) {
          const from = getNodeModulesPath(collection.caip2, collection.namespace, image.path);
          const to = join(this.target, image.path);
          count++;
          await copyFile(from, to);
        }
      }

      this.context.stdout.write(`Mirrored ${count} files for "${collection.caip2}/${collection.namespace}"\n`);
    }
  }
}

// noinspection JSIgnoredPromiseFromCall
void runExit([MirrorCommand]);
