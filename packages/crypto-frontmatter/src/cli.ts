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
      const indexArray = await getFrontmatterIndexArray(collection.caip2, collection.namespace);
      for (const frontmatterIndex of indexArray) {
        for (const frontmatterImage of frontmatterIndex.fields.images) {
          const from = getNodeModulesPath(collection.caip2, collection.namespace, frontmatterImage.path);
          const to = join(this.target, frontmatterImage.path);
          await copyFile(from, to);
        }
      }

      this.context.stdout.write(
        `Mirrored ${indexArray.length} files for collection "${collection.caip2}/${collection.namespace}"\n`,
      );
    }
  }
}

// noinspection JSIgnoredPromiseFromCall
void runExit([MirrorCommand]);
