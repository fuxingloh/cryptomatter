import { decodeCaip19 } from './caip19';

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
 * Statically import (via CJS require) @crypto-frontmatter module with CAIP-2 and Asset TYPE
 * This is a workaround to allow dynamic import of @crypto-frontmatter module for use within webpack.
 *
 * All @crypto-frontmatter modules are statically mapped here and must be installed as a project dependency
 * if you want to use it.
 * For example, you must install @crypto-frontmatter/eip155-1-erc20 if you want to use eip155:1/erc frontmatter.
 *
 * @param caip2 {string}
 * @param type {string}
 * @param path {string}
 * @return {any}
 */
export function requireCryptoFrontmatter(caip2: string, type: string, path: string): any {
  /* eslint-disable no-undef */
  switch (`${caip2}/${type}`) {
    case 'eip155:1/erc20':
      return require('@crypto-frontmatter/eip155-1-erc20/dist/Frontmatter/' + path);
    case 'eip155:10/erc20':
      return require('@crypto-frontmatter/eip155-10-erc20/dist/Frontmatter/' + path);
    case 'eip155:56/erc20':
      return require('@crypto-frontmatter/eip155-56-erc20/dist/Frontmatter/' + path);
    case 'eip155:137/erc20':
      return require('@crypto-frontmatter/eip155-137-erc20/dist/Frontmatter/' + path);
    case 'eip155:8453/erc20':
      return require('@crypto-frontmatter/eip155-8453-erc20/dist/Frontmatter/' + path);
    case 'eip155:42161/erc20':
      return require('@crypto-frontmatter/eip155-42161-erc20/dist/Frontmatter/' + path);
    case 'eip155:42220/erc20':
      return require('@crypto-frontmatter/eip155-42220-erc20/dist/Frontmatter/' + path);
    case 'eip155:43114/erc20':
      return require('@crypto-frontmatter/eip155-43114-erc20/dist/Frontmatter/' + path);
    case 'eip155:1313161554/erc20':
      return require('@crypto-frontmatter/eip155-1313161554-erc20/dist/Frontmatter/' + path);
    default:
      throw new Error(`Unknown CAIP-2: ${caip2} and Asset TYPE: ${type}`);
  }
  /* eslint-enable no-undef */
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
