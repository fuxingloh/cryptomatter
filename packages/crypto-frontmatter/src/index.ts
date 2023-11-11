import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

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
    images: FrontmatterImage[];
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
  ['tip474:728126428', 'trc10'],
  ['tip474:728126428', 'trc20'],
];

/**
 * Decode CAIP-19 into CAIP-2, Asset NAMESPACE, and Asset REFERENCE
 * @return {[string, string, string]}
 */
export function decodeCaip19(caip19: string): string[] {
  const [caip2, asset] = caip19.split('/');
  const [caip2Type, caip2Reference] = caip2.split(':');
  const [namespace, reference] = asset.split(':');
  return [caip2Type, caip2Reference, namespace, reference];
}

function sha256(input: string): string {
  return createHash('sha256').update(input).digest('hex');
}

/**
 * Encode CAIP-19 into fileId
 * If Namespace is ERC20, the address field will be converted to lowercase.
 */
export function computeFileId(caip19: string): string {
  const [caip2, asset] = caip19.split('/');
  const [namespace, reference] = asset.split(':');

  if (namespace === 'erc20') {
    return sha256(`${caip2}/${namespace}:${reference.toLowerCase()}`);
  }
  return sha256(caip19);
}

export async function readCryptoFrontmatterFile(caip2: string, namespace: string, file: string): Promise<any> {
  const [caip2Type, caip2Reference] = caip2.split(':');
  const path = join(
    'node_modules',
    '@crypto-frontmatter',
    `${caip2Type}-${caip2Reference}-${namespace}`,
    'dist',
    'Frontmatter',
    file,
  );
  const contents = await readFile(path, {
    encoding: 'utf-8',
  });
  return JSON.parse(contents);
}

/**
 * Get FrontmatterIndex collection of CAIP-2 and Asset TYPE
 * @param caip2 {string}
 * @param namespace {string}
 * @return {FrontmatterIndex[]}
 */
export async function getFrontmatterCollection(caip2: string, namespace: string): Promise<FrontmatterIndex[]> {
  return readCryptoFrontmatterFile(caip2, namespace, 'index.json');
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
  const fileId = computeFileId(caip19);
  const [caip2, asset] = caip19.split('/');
  const [namespace] = asset.split(':');
  return readCryptoFrontmatterFile(caip2, namespace, `${fileId}.json`);
}
