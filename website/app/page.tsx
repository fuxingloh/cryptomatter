import { clsx } from 'clsx';
import { getInstalledFrontmatterCollection } from 'crypto-frontmatter';
import Link from 'next/link';
import type { ReactElement } from 'react';

export default async function Page(): Promise<ReactElement> {
  const collections = await getInstalledFrontmatterCollection();
  return (
    <main>
      <div className="mx-auto w-full overflow-x-auto">
        <table
          className={clsx(
            'min-w-full',
            'whitespace-nowrap text-left lg:whitespace-normal',
            '[&_tr_:is(th,td)]:font-normal',
            '[&_tr_:is(th,td)]:py-2.5',
            'divide-mono-900 divide-y',
            '[&_tbody]:divide-mono-900 [&_tbody]:divide-y',
          )}
        >
          <thead className="text-mono-600 text-sm">
            <tr>
              <th>PACKAGE NAME</th>
              <th>CAIP2</th>
              <th>NAMESPACE</th>
            </tr>
          </thead>

          <tbody>
            {collections.map((item) => (
              <tr className="text-mono-200 hover:bg-mono-900 relative cursor-pointer">
                <td>
                  <Link href={`/${item.caip2}`} className="">
                    {item.name}
                    <div className="absolute inset-0" />
                  </Link>
                </td>
                <td className="">{item.caip2}</td>
                <td>{item.namespace}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
