import { createHash } from 'node:crypto';
import { readdir, readFile, stat } from 'node:fs/promises';
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

export interface FrontmatterCollection {
  name: string;
  caip2: string;
  namespace: string;
}

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

function hasFile(filepath: string): Promise<boolean> {
  return stat(filepath).then(
    () => true,
    () => false,
  );
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

export function getNodeModulesPath(caip2: string, namespace: string, file: string) {
  const [caip2Type, caip2Reference] = caip2.split(':');
  return join(
    'node_modules',
    '@crypto-frontmatter',
    `${caip2Type}-${caip2Reference}-${namespace}`,
    'dist',
    'Frontmatter',
    file,
  );
}

export async function getInstalledFrontmatterCollection(): Promise<FrontmatterCollection[]> {
  const scopePath = join('node_modules', '@crypto-frontmatter');
  const collections: FrontmatterCollection[] = [];

  for (const dir of await readdir(scopePath)) {
    const packagePath = join(scopePath, dir, 'package.json');
    if (!(await hasFile(packagePath))) {
      continue;
    }
    const contents = await readFile(packagePath, {
      encoding: 'utf-8',
    });
    const packageJson = JSON.parse(contents);
    collections.push({
      name: packageJson.name,
      ...packageJson.config,
    });
  }
  return collections;
}

/**
 * Get the collection FrontmatterIndex with CAIP-2 and Asset TYPE
 * @param caip2 {string}
 * @param namespace {string}
 * @return {FrontmatterIndex[]}
 */
export async function getFrontmatterIndexArray(caip2: string, namespace: string): Promise<FrontmatterIndex[]> {
  const path = getNodeModulesPath(caip2, namespace, 'index.json');
  const contents = await readFile(path, {
    encoding: 'utf-8',
  });
  return JSON.parse(contents);
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

  const path = getNodeModulesPath(caip2, namespace, `${fileId}.json`);
  if (!(await hasFile(path))) {
    return undefined;
  }
  const contents = await readFile(path, {
    encoding: 'utf-8',
  });
  return JSON.parse(contents);
}
