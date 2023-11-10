import { readFile } from 'fs/promises';
import { join } from 'path';

import { decodeCaip19 } from './caip19';
import { FrontmatterIndex, getFrontmatterCollection } from './index';

export interface FrontmatterContent extends FrontmatterIndex {
  html: string;
  caip2: string;
  namespace: string;
}

/**
 * Get FrontmatterContent using CAIP-19, returns undefined if not found
 * This includes the HTML content of the Frontmatter.
 *
 * @param caip19 {string}
 * @see FrontmatterContent.html
 * @return {FrontmatterContent | undefined}
 */
export async function getFrontmatterContent(caip19: string): Promise<FrontmatterContent | undefined> {
  const [caip2, type, reference] = decodeCaip19(caip19);
  const collection = getFrontmatterCollection(caip2, type);
  const index = collection.find((value: FrontmatterIndex) => {
    const [, , aReference] = decodeCaip19(value.path);
    return aReference.toLowerCase() === reference.toLowerCase();
  });
  if (index === undefined) {
    return undefined;
  }

  const [caip2Type, caip2Reference] = caip2.split(':');
  const path = join(
    'node_modules',
    '@crypto-frontmatter',
    `${caip2Type}-${caip2Reference}-${type}`,
    'dist',
    'Frontmatter',
    `${index.fileId}.json`,
  );
  const contents = await readFile(path, {
    encoding: 'utf-8',
  });
  return JSON.parse(contents);
}
