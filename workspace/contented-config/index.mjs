import {
  MarkdownPipeline,
  rehypeExternalLinks,
  rehypeStringify,
  remarkFrontmatter,
  remarkFrontmatterCollect,
  remarkFrontmatterResolve,
  remarkFrontmatterValidate,
  remarkGfm,
  remarkParse,
  remarkRehype,
} from '@contentedjs/contented-pipeline-md';
import { join } from 'node:path';
import { copyFile, mkdir } from 'node:fs/promises';

/** @type {import('@contentedjs/contented').ContentedConfig} */
const config = {
  processor: {
    outDir: 'dist',
    pipelines: [
      {
        type: 'Frontmatter',
        dir: 'frontmatter',
        pattern: '**/README.md',
        /**
         * To reduce complexity,
         * only enable a subset of plugins for levain-examples to keep the authoring experience simple.
         */
        processor: MarkdownPipeline.withProcessor((processor) => {
          processor
            .use(remarkGfm)
            .use(remarkFrontmatter)
            .use(remarkParse)
            .use(remarkFrontmatterCollect)
            .use(remarkFrontmatterResolve)
            .use(remarkFrontmatterValidate)
            .use(remarkRehype)
            .use(rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] })
            .use(rehypeStringify);
        }),
        fields: {
          symbol: {
            type: 'string',
            required: true,
          },
          decimals: {
            type: 'number',
            required: true,
          },
          tags: {
            type: 'string[]',
            required: false,
          },
          links: {
            type: 'object',
            required: false,
          },
        },
        transform: async (fileContent, filePath) => {
          // Move dist/Frontmatter/*.png to dist
          // Move logo.png to dist
          const path = `/${filePath.replace(/\/README\.md$/, '')}`;
          const pngLogoPath = join(process.cwd(), 'frontmatter', path, 'logo.png');
          const dir = join(process.cwd(), 'dist', 'Frontmatter');
          await mkdir(dir, { recursive: true });
          await copyFile(pngLogoPath, join(dir, fileContent.fileId + '.png'));

          // Use Sharp to resize logo.png to 32x32 and 16x16

          return {
            ...fileContent,
            path: path,
            sections: [],
            headings: [],
          };
        },
      },
    ],
  },
};

export default config;
