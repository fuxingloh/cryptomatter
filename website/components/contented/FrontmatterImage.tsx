'use client';
import type { FrontmatterIndex } from 'crypto-frontmatter';
import { requireCryptoFrontmatter } from 'crypto-frontmatter/require';
import Image from 'next/image';
import type { ReactElement } from 'react';

export function FrontmatterImage(props: { frontmatter: FrontmatterIndex; type: 'logo' }): ReactElement {
  const image = props.frontmatter.fields.images?.find((image) => image.type === props.type);
  if (image === undefined) {
    return <></>;
  }

  return (
    <Image
      src={requireCryptoFrontmatter(props.frontmatter.fields.caip2, props.frontmatter.fields.namespace, image.path)}
      alt={`${props.frontmatter.fields.symbol} ${props.type}`}
      width={image.size.width}
      height={image.size.height}
    />
  );
}
