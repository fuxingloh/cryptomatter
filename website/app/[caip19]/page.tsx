import Image from 'next/image';
import type { ReactElement } from 'react';

export default async function Page(props: {
  params: {
    caip19: string;
  };
}): Promise<ReactElement> {
  const caip19 = props.params.caip19;
  const image = await import(`@crypto-frontmatter/eip155-1-erc20/dist/Frontmatter/${caip19}.png`);

  return (
    <main className="flex h-full min-w-0 flex-grow flex-col">
      <div className="flex-auto pb-48">
        {caip19}

        <Image src={image} alt={`${caip19} logo`} width={50} height={50} />
      </div>
    </main>
  );
}
