import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { requireCryptoFrontmatter } from './require';

export interface FrontmatterLink {
  name: string;
  url: string;
}

export interface FrontmatterImage {
  type: string;
  mine: string;
  size: {
    width: number;
    height: number;
  };
  path: string;
}

export interface FrontmatterIndex {
  path: string;
  fileId: string;
  modifiedDate: number;
  type: string;
  fields: {
    caip2: string;
    namespace: string;
    symbol: string;
    decimals: number;
    title?: string;
    description?: string;
    tags?: string[];
    links?: FrontmatterLink[];
    images?: FrontmatterImage[];
  };
}

export interface FrontmatterContent extends FrontmatterIndex {
  html: string;
}

export const SupportedCollections = [
  ['eip155:1', 'erc20'],
  ['eip155:10', 'erc20'],
  ['eip155:56', 'erc20'],
  ['eip155:137', 'erc20'],
  ['eip155:8453', 'erc20'],
  ['eip155:42161', 'erc20'],
  ['eip155:42220', 'erc20'],
  ['eip155:43114', 'erc20'],
  ['eip155:1313161554', 'erc20'],
];

/**
 * Decode CAIP-19 into CAIP-2, Asset TYPE, and Asset REFERENCE
 * @return {[string, string, string]}
 */
export function decodeCaip19(caip19: string): string[] {
  const [caip2, asset] = caip19.split('/');
  const [type, reference] = asset.split(':');
  return [caip2, type, reference];
}

/**
 * Get FrontmatterIndex collection of CAIP-2 and Asset TYPE
 * requireCryptoFrontmatter is used to statically import the `@crypto-frontmatter` module using the Node.JS require
 * architecture
 *
 * @param caip2 {string}
 * @param type {string}
 * @return {FrontmatterIndex[]}
 */
export function getFrontmatterCollection(caip2: string, type: string): FrontmatterIndex[] {
  return requireCryptoFrontmatter(caip2, type, 'index.json');
}

/**
 * Get a single FrontmatterIndex using CAIP-19, returns undefined if not found
 * @param caip19 {string}
 * @return {FrontmatterIndex | undefined}
 */
export function getFrontmatterIndex(caip19: string): FrontmatterIndex | undefined {
  const [caip2, type, reference] = decodeCaip19(caip19);
  const collection = getFrontmatterCollection(caip2, type);
  return collection.find((value: FrontmatterIndex) => {
    const [, , aReference] = decodeCaip19(value.path);
    return aReference.toLowerCase() === reference.toLowerCase();
  });
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
