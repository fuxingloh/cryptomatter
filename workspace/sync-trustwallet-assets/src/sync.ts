import { copyFile, mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises';

import { stringify } from 'yaml';

import { getAuthorName } from './gitlog';

interface Info {
  name: string;
  website: string;
  description: string;
  explorer: string;
  type: string;
  symbol: string;
  decimals: number;
  status: string;
  id: string;
  tags: string[];
  links: {
    name: string;
    url: string;
  }[];
}

export abstract class Sync {
  constructor(
    protected readonly from: string,
    protected readonly to: string,
  ) {}

  async sync() {
    for (const dir of await readdir(this.from)) {
      const info = JSON.parse(
        await readFile(`${this.from}/${dir}/info.json`, {
          encoding: 'utf-8',
        }),
      ) as Partial<Info>;

      if (!(await this.shouldWrite(dir, info))) continue;
      await this.write(dir, info);
    }
  }

  async shouldWrite(dir: string, info: Partial<Info>): Promise<boolean> {
    // Make sure logo.png and info.json exists
    const hasFromLogo = await hasFile(`${this.from}/${dir}/logo.png`);
    const hasFromInfo = await hasFile(`${this.from}/${dir}/info.json`);
    if (!hasFromLogo || !hasFromInfo) return false;

    // If README.md and logo.png do not exist on the other side, write it
    const namespace = this.getNamespace(info);
    const hasToLogo = await hasFile(`${this.to}/${namespace}/logo.png`);
    const hasToReadme = await hasFile(`${this.to}/${namespace}/README.md`);
    if (!hasToLogo || !hasToReadme) return true;

    // Otherwise, allow overwriting if the author is Frontmatter Bot
    const name = await getAuthorName(`${this.to}/${namespace}/README.md`);
    return name === 'Frontmatter Bot';
  }

  abstract write(dir: string, info: Partial<Info>): Promise<void>;

  abstract getNamespace(info: Partial<Info>): string;

  createLinks(info: Partial<Info>): Info['links'] {
    const links: Info['links'] = [];
    if (info.website) links.push({ name: 'website', url: info.website });
    if (info.explorer) links.push({ name: 'explorer', url: info.explorer });

    if (info.links) {
      for (const link of info.links) {
        if (link.name === 'website' || link.name === 'explorer') continue;
        if (!link.url?.startsWith('https://')) continue;
        if (!link.name) continue;
        links.push(link);
      }
    }
    return links;
  }
}

function hasFile(filepath: string): Promise<boolean> {
  return stat(filepath).then(
    () => true,
    () => false,
  );
}

export class Eip155Erc20Sync extends Sync {
  async write(dir: string, info: Partial<Info>): Promise<void> {
    const namespace = this.getNamespace(info);
    await mkdir(`${this.to}/${namespace}`, { recursive: true });
    await copyFile(`${this.from}/${dir}/logo.png`, `${this.to}/${namespace}/logo.png`);
    await writeFile(
      `${this.to}/${namespace}/README.md`,
      [
        `---`,
        stringify({
          symbol: info.symbol,
          decimals: info.decimals,
          tags: info.tags,
          links: this.createLinks(info),
        }),
        `---`,
        '',
        `# ${info.name}`,
        '',
        info.description !== '-' ? info.description : '',
      ].join('\n'),
    );
  }

  getNamespace(info: Partial<Info>): string {
    return info.id!;
  }
}
