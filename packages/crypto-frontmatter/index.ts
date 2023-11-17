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

export interface FrontmatterNamespace {
  package: string;
  caip2: string;
  dir: string;
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

  if (namespace === 'erc20' && reference) {
    return sha256(`${caip2}/${namespace}:${reference.toLowerCase()}`);
  }
  return sha256(caip19);
}

export function getNodeModulesPath(caip2: string, namespace: string, file: string) {
  const [caip2Type, caip2Reference] = caip2.split(':');
  return join('node_modules', '@crypto-frontmatter', `${caip2Type}-${caip2Reference}`, `_${namespace}`, file);
}

export async function getInstalledNamespaces(): Promise<FrontmatterNamespace[]> {
  const scopePath = join('node_modules', '@crypto-frontmatter');
  const namespaces: FrontmatterNamespace[] = [];

  for (const dir of await readdir(scopePath)) {
    const indexJsonPath = join(scopePath, dir, 'index.json');
    if (!(await hasFile(indexJsonPath))) {
      continue;
    }
    const indexJson = JSON.parse(
      await readFile(indexJsonPath, {
        encoding: 'utf-8',
      }),
    ) as {
      package: string;
      caip2: string;
      namespaces: { dir: string; namespace: string }[];
    };
    namespaces.push(
      ...indexJson.namespaces.map(({ dir, namespace }) => {
        return {
          package: indexJson.package,
          caip2: indexJson.caip2,
          dir,
          namespace,
        };
      }),
    );
  }
  return namespaces;
}

/**
 * Get the collection FrontmatterIndex with CAIP-2 and Asset TYPE
 * @param caip2 {string}
 * @param namespace {string}
 * @return {FrontmatterIndex[]}
 */
export async function getIndex(caip2: string, namespace: string): Promise<FrontmatterIndex[]> {
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
export async function getFrontmatter(caip19: string): Promise<FrontmatterContent | undefined> {
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
