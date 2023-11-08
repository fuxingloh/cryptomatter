export interface FrontmatterLink {
  name: string;
  url: string;
}

export interface FrontmatterImage {
  type: string
  mine: string;
  size: {
    width: number
    height: number
  },
  path: string;
}

export interface FrontmatterIndex {
  fileId: string;
  type: string;
  path: string;
  modifiedDate: number;
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

export interface Frontmatter extends FrontmatterIndex {
  html: string;
}

export function getPackageName(caip19: string): string {
  const [caip2, asset] = caip19.split('/');
  const [caip2Namespace, caip2Reference] = caip2.split(':');
  const [assetNamespace] = asset.split(':');
  return `@crypto-frontmatter/${caip2Namespace}-${caip2Reference}-${assetNamespace}`;
}

export function findFrontmatterIndex(collection: FrontmatterIndex[], caip19: string): FrontmatterIndex | undefined {
  return collection.find((value: FrontmatterIndex) => value.path === caip19);
}

export function getFrontmatterImportPath(index: FrontmatterIndex): string {
  const packageName = getPackageName(index.path);
  return `${packageName}/dist/Frontmatter/${index.fileId}.json`;
}
