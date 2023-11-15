/**
 * Statically import (via CJS require) @crypto-frontmatter module with CAIP-2 and Asset TYPE
 * This is a workaround to allow dynamic import of @crypto-frontmatter module for use within webpack.
 *
 * All @crypto-frontmatter modules are statically mapped here and must be installed as a project dependency
 * if you want to use it.
 * For example, you must install @crypto-frontmatter/eip155-1-erc20 if you want to use eip155:1/erc frontmatter.
 *
 * @deprecated scheduled for removal
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
    case 'tip474:728126428/trc10':
      return require('@crypto-frontmatter/tip474-728126428-trc10/dist/Frontmatter/' + path);
    case 'tip474:728126428/trc20':
      return require('@crypto-frontmatter/tip474-728126428-trc20/dist/Frontmatter/' + path);

    default:
      throw new Error(`Unknown CAIP-2: ${caip2} and Asset TYPE: ${type}`);
  }
  /* eslint-enable no-undef */
}
