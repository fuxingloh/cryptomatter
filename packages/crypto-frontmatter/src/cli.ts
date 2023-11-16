import { copyFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

import { Command, Option, runExit } from 'clipanion';

import {
  FrontmatterCollection,
  getFrontmatterIndexArray,
  getInstalledFrontmatterCollection,
  getNodeModulesPath,
} from './index';

export class MirrorCommand extends Command {
  static override paths = [[`mirror`]];
  private target = Option.String();
  private include = Option.Array(`--include`, { required: false }) ?? ['index.json', 'frontmatter.json', 'images'];

  private async mirrorFile(collection: FrontmatterCollection, file: string): Promise<void> {
    const from = getNodeModulesPath(collection.caip2, collection.namespace, file);
    const to = join(this.target, file);
    await copyFile(from, to);
  }

  async execute(): Promise<number | void> {
    await mkdir(this.target, { recursive: true });

    for (const collection of await getInstalledFrontmatterCollection()) {
      let count = 0;

      if (this.include.includes('index.json')) {
        await this.mirrorFile(collection, 'index.json');
        count++;
      }

      for (const index of await getFrontmatterIndexArray(collection.caip2, collection.namespace)) {
        if (this.include.includes('frontmatter.json')) {
          await this.mirrorFile(collection, index.fileId + '.json');
          count++;
        }

        if (this.include.includes('images')) {
          for (const image of index.fields.images) {
            await this.mirrorFile(collection, image.path);
            count++;
          }
        }
      }

      this.context.stdout.write(`Mirrored ${count} files for "${collection.caip2}/${collection.namespace}"\n`);
    }
  }
}

// noinspection JSIgnoredPromiseFromCall
void runExit([MirrorCommand]);
