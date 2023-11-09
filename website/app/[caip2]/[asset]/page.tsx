import { FrontmatterIndex, getFrontmatterContent, getFrontmatterIndex } from 'crypto-frontmatter';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { ReactElement } from 'react';

import { ContentedProse } from '@/components/contented/ContentedProse';
import { FrontmatterImage } from '@/components/contented/FrontmatterImage';

function asCaip19(caip2: string, asset: string): string {
  return `${decodeURIComponent(caip2)}/${decodeURIComponent(asset)}`;
}

// TODO(fuxingloh): generateStaticParams

export async function generateMetadata(props: Parameters<typeof Page>[0]): Promise<Metadata> {
  const baseUrl = process.env.BASE_URL!;
  const caip19 = asCaip19(props.params.caip2, props.params.asset);
  const frontmatterIndex: FrontmatterIndex | undefined = getFrontmatterIndex(caip19);
  if (frontmatterIndex === undefined) {
    return notFound();
  }

  const title = frontmatterIndex.fields.title ?? frontmatterIndex.fields.symbol;

  return {
    title: title,
    description: frontmatterIndex.fields.description,
    openGraph: {
      title: title,
      description: frontmatterIndex.fields.description,
      url: `${baseUrl}/${frontmatterIndex.path}`,
      siteName: `Crypto Frontmatter`,
      locale: 'en_US',
      type: 'article',
      modifiedTime: new Date(frontmatterIndex.modifiedDate).toISOString(),
    },
  };
}

export default async function Page(props: {
  params: {
    caip2: string;
    asset: string;
  };
}): Promise<ReactElement> {
  const caip19 = asCaip19(props.params.caip2, props.params.asset);
  const frontmatterContent = getFrontmatterContent(caip19);
  if (frontmatterContent === undefined) {
    return notFound();
  }

  return (
    <main className="flex h-full min-w-0 flex-grow flex-col">
      <div className="flex-auto pb-48">
        <div className="mb-6 h-12 w-12">
          <FrontmatterImage frontmatter={frontmatterContent} type="logo" />
        </div>

        <ContentedProse html={frontmatterContent.html} />

        <pre>{JSON.stringify(frontmatterContent, null, 2)}</pre>
      </div>
    </main>
  );
}
