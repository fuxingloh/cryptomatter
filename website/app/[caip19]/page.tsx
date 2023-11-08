import Image from 'next/image';
import type { ReactElement } from 'react';
import { notFound } from 'next/navigation';
import { findFrontmatterIndex, FrontmatterIndex } from 'crypto-frontmatter';

export default async function Page(props: {
  params: {
    caip19: string;
  };
}): Promise<ReactElement> {
  // 0x00000000008943c65cAf789FFFCF953bE156f6f8
  const caip19 = 'eip155:1/erc20:0x00000000008943c65cAf789FFFCF953bE156f6f8';
  // const packageName = getPackageName(caip19);
  const { FrontmatterIndex } = await import('@crypto-frontmatter/eip155-1-erc20');

  const frontmatter = findFrontmatterIndex(FrontmatterIndex, caip19);
  if (frontmatter === undefined) {
    return notFound();
  }

  return (
    <main className="flex h-full min-w-0 flex-grow flex-col">
      <div className="flex-auto pb-48">
        <div className="w-8 h-8 mb-6">
          <ImageLogo frontmatter={frontmatter} />
        </div>

        <pre>{JSON.stringify(frontmatter, null, 2)}</pre>
      </div>
    </main>
  );
}


async function ImageLogo(props: {
  frontmatter: FrontmatterIndex;
}): Promise<ReactElement> {
  // const packageName = getPackageName(props.frontmatter.path);
  const image = props.frontmatter.fields.images?.find((image) => image.type === 'logo');
  if (image === undefined) {
    return <></>;
  }

  console.log(image.path)

  const imageSrc = await import(`@crypto-frontmatter/eip155-1-erc20/dist/${image?.path.replace('dist/', '')}`);
  return (
    <Image
      src={imageSrc}
      alt={`${props.frontmatter.fields.symbol} logo`}
      width={image.size.width}
      height={image.size.height}
    />
  );
}