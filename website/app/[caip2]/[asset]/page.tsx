import { FrontmatterContent, FrontmatterIndex, getFrontmatterContent } from 'crypto-frontmatter';
import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { ReactElement } from 'react';
import { Highlighter } from 'shiki';

import { ContentedProse } from '@/components/contented/ContentedProse';
import { loadHighlighter, ShikiHighlighter } from '@/components/contented/ShikiHighlighter';

function asCaip19(caip2: string, asset: string): string {
  return `${decodeURIComponent(caip2)}/${decodeURIComponent(asset)}`;
}

export async function generateMetadata(props: Parameters<typeof Page>[0]): Promise<Metadata> {
  const baseUrl = process.env.BASE_URL!;
  const caip19 = asCaip19(props.params.caip2, props.params.asset);
  const frontmatterIndex: FrontmatterIndex | undefined = await getFrontmatterContent(caip19);
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
  const content = await getFrontmatterContent(caip19);
  if (content === undefined) {
    return notFound();
  }

  const image = content.fields.images?.find((image) => image.type === 'logo');

  return (
    <main className="flex h-full min-w-0 flex-grow flex-col">
      <div className="flex-auto pb-48">
        {image !== undefined && (
          <div className="mb-6 h-12 w-12">
            <Image
              src={`/crypto-frontmatter/${image.path}`}
              alt={`${content.fields.symbol} Logo`}
              width={image.size.width}
              height={image.size.height}
            />
          </div>
        )}

        <ContentedProse html={content.html} />

        <FrontmatterJson content={content} highlighter={await loadHighlighter()} />
      </div>
    </main>
  );
}

function FrontmatterJson(props: { content: FrontmatterContent; highlighter: Highlighter }): ReactElement {
  return (
    <div className="border-mono-800 group/json mt-8 rounded border">
      <header className="bg-mono-950 text-mono-500 relative flex items-center justify-between rounded-t border-b px-4 py-2 text-sm">
        <div>Frontmatter.json</div>
        <div>
          <button>
            <div className="block group-focus-within/json:hidden">▲</div>
            <div className="hidden group-focus-within/json:block">▼</div>
          </button>
          <span className="absolute inset-0 hidden cursor-pointer group-focus-within/json:block" />
        </div>
      </header>

      <div tabIndex={1}>
        <ShikiHighlighter
          className="max-h-40 overflow-hidden px-4 py-3 text-sm group-focus-within/json:max-h-full group-focus-within/json:overflow-x-auto"
          highlighter={props.highlighter}
          code={JSON.stringify(props.content, null, 2)}
          language="json"
        />
      </div>
    </div>
  );
}
