'use client';
import { decodeCaip19, FrontmatterIndex, requireCryptoFrontmatter } from 'crypto-frontmatter';
import Image from 'next/image';
import type { ReactElement } from 'react';

export function FrontmatterImage(props: { frontmatter: FrontmatterIndex; type: 'logo' }): ReactElement {
  const image = props.frontmatter.fields.images?.find((image) => image.type === props.type);
  if (image === undefined) {
    return <></>;
  }

  const [caip2, type] = decodeCaip19(props.frontmatter.path);
  return (
    <Image
      src={requireCryptoFrontmatter(caip2, type, image.path)}
      alt={`${props.frontmatter.fields.symbol} ${props.type}`}
      width={image.size.width}
      height={image.size.height}
    />
  );
}
