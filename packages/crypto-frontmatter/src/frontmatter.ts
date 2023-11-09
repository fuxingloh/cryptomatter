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
    case 'eip155:137/erc20':
      return require('@crypto-frontmatter/eip155-137-erc20/dist/Frontmatter/' + path);
    case 'eip155:43114/erc20':
      return require('@crypto-frontmatter/eip155-43114-erc20/dist/Frontmatter/' + path);
    default:
      throw new Error(`Unknown CAIP-2: ${caip2} and Asset TYPE: ${type}`);
  }
  /* eslint-enable no-undef */
}

/**
 * Get FrontmatterIndex collection of CAIP-2 and Asset TYPE
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
  const [caip2, type] = decodeCaip19(caip19);
  const collection = getFrontmatterCollection(caip2, type);
  const index = collection.find((value: FrontmatterIndex) => value.path === caip19);
  if (index === undefined) {
    return undefined;
  }

  // Remove unused fields
  return {
    path: index.path,
    fileId: index.fileId,
    modifiedDate: index.modifiedDate,
    type: index.type,
    fields: index.fields,
  };
}

/**
 * Get FrontmatterContent using CAIP-19, returns undefined if not found
 * This includes the HTML content of the Frontmatter.
 *
 * @param caip19 {string}
 * @see FrontmatterContent.html
 * @return {FrontmatterContent | undefined}
 */
export function getFrontmatterContent(caip19: string): FrontmatterContent | undefined {
  const [caip2, type] = decodeCaip19(caip19);
  const collection = getFrontmatterCollection(caip2, type);
  const index = collection.find((value: FrontmatterIndex) => value.path === caip19);
  if (index === undefined) {
    return undefined;
  }

  const content = requireCryptoFrontmatter(caip2, type, index.fileId + '.json');
  return {
    path: content.path,
    fileId: content.fileId,
    modifiedDate: content.modifiedDate,
    type: content.type,
    fields: content.fields,
    html: content.html,
  };
}
