import { mkdir, readdir, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { Command } from 'clipanion';
import { stringify } from 'yaml';

export interface README {
  frontmatter: {
    symbol: string;
    decimals: number;
    tags: string[];
    links: {
      name: string;
      url: string;
    }[];
  };
  title: string;
  body: string;
}

export abstract class SyncCommand<Data> extends Command {
  async walkDir(
    dir: string,
    options: {
      toPath: (data: Data) => string;
      filter: (data: Data) => boolean;
    },
  ): Promise<void> {
    for (const entry of await readdir(dir)) {
      const fromPath = join(dir, entry);
      const data = await this.readData(fromPath);

      if (data === undefined) continue;
      if (!options.filter(data)) continue;

      const toPath = options.toPath(data);
      if (!(await this.shouldWrite(data, fromPath, toPath))) continue;
      await this.write(data, fromPath, toPath);
    }
  }

  abstract readData(fromPath: string): Promise<Data | undefined>;

  abstract toREADME(data: Data): README;

  async shouldWrite(data: Data, fromPath: string, toPath: string): Promise<boolean> {
    return !(await hasFile(join(toPath, 'LOCK')));
  }

  async write(data: Data, fromPath: string, toPath: string): Promise<void> {
    await mkdir(toPath, { recursive: true });
    const readmeMd = this.toREADME(data);

    await writeFile(
      join(toPath, 'README.md'),
      [`---`, stringify(readmeMd.frontmatter), `---`, '', `# ${readmeMd.title}`, '', readmeMd.body].join('\n'),
    );
  }
}

export function hasFile(filepath: string): Promise<boolean> {
  return stat(filepath).then(
    () => true,
    () => false,
  );
}
