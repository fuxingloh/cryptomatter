/**
 * Decode CAIP-19 into CAIP-2, Asset TYPE, and Asset REFERENCE
 * @return {[string, string, string]}
 */
export function decodeCaip19(caip19: string): string[] {
  const [caip2, asset] = caip19.split('/');
  const [type, reference] = asset.split(':');
  return [caip2, type, reference];
}
