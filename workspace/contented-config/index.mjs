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
import { copyFile } from 'node:fs/promises';
import { imageSize } from 'image-size';
import { mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';

/**
 * To reduce complexity,
 * we only enable a subset of plugins for frontmatter to keep the authoring experience simple.
 */
const MDProcessor = MarkdownPipeline.withProcessor((processor) => {
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
});

function sha256(data) {
  return createHash('sha256').update(data).digest('hex');
}

/**
 * @param fileId {string}
 * @param filePath {string}
 * @return {Promise<[{mine: string, path: string}]>}
 */
async function computeImageField(fileId, filePath) {
  const reference = filePath.replace(/\/README\.md$/, '');
  const pngLogoPath = join('frontmatter', reference, 'logo.png');
  const size = imageSize(pngLogoPath);

  const imagePath = fileId + '.logo.png';
  await copyFile(pngLogoPath, join('dist', 'Frontmatter', imagePath));

  return [
    {
      type: 'logo',
      mine: 'image/png',
      size: {
        width: size.width,
        height: size.height,
      },
      path: imagePath,
    },
  ];
}

function computeFileId(caip19) {
  const [caip2, asset] = caip19.split('/');
  const [namespace, reference] = asset.split(':');

  if (namespace === 'erc20') {
    return sha256(`${caip2}/${namespace}:${reference.toLowerCase()}`);
  }

  return sha256(caip19);
}

/**
 * @param options {{caip2: string, namespace: string}}
 * @return {import('@contentedjs/contented').ContentedConfig}
 */
export default function config(options) {
  mkdirSync(join('dist', 'Frontmatter'), { recursive: true });

  return {
    processor: {
      outDir: 'dist',
      pipelines: [
        {
          type: 'Frontmatter',
          dir: 'frontmatter',
          pattern: '**/README.md',
          processor: MDProcessor,
          fields: {
            caip2: {
              type: 'string',
              resolve: () => {
                return options.caip2;
              },
            },
            namespace: {
              type: 'string',
              resolve: () => {
                return options.namespace;
              },
            },
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
            /**
             * Populated by computeImageField
             */
            images: {
              type: 'object',
              required: false,
            },
          },
          transform: async (fileContent, filePath) => {
            const reference = filePath.replace(/\/README\.md$/, '');
            const caip19 = `${options.caip2}/${options.namespace}:${reference}`;
            const fileId = computeFileId(caip19);

            // Only return essential fields to reduce the size of the JSON file.
            return {
              path: caip19,
              fileId: fileId,
              modifiedDate: fileContent.modifiedDate,
              type: fileContent.type,
              fields: {
                ...fileContent.fields,
                images: await computeImageField(fileId, filePath),
              },
              html: fileContent.html,
            };
          },
        },
      ],
    },
  };
}
