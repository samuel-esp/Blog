import type {ParseFrontMatter} from '@docusaurus/types';
import type {Plugin} from 'unified';
import {visit} from 'unist-util-visit';
import type {Literal, Node} from 'unist';
import path from 'path';

const references: Map<string, {urlPath: string; title: string; file: string}> =
  new Map();

function getDocsUrlPath(filePath: string): string | null {
  const docsDirMarker = `${path.sep}docs${path.sep}`;
  const markerIndex = filePath.lastIndexOf(docsDirMarker);

  if (markerIndex < 0) {
    return null;
  }

  const relativePath = filePath.slice(markerIndex + docsDirMarker.length);
  const withoutExt = relativePath.replace(/\.(md|mdx)$/i, '');

  // Convert docs/foo/index.mdx to /docs/foo.
  const normalized = withoutExt.replace(/(^|\/)index$/i, '');
  const encodedPath = normalized
    .split('/')
    .filter(Boolean)
    .map((part) => encodeURIComponent(part))
    .join('/');

  return encodedPath ? `/docs/${encodedPath}` : '/docs';
}

export const globalRefParseFrontMatter: ParseFrontMatter = async ({
  defaultParseFrontMatter,
  fileContent,
  filePath,
}) => {
  const result = await defaultParseFrontMatter({
    fileContent,
    filePath,
  });

  // Partial markdown files do not contain frontmatter and should not be referenced.
  if (path.basename(filePath).startsWith('_')) {
    return result;
  }

  const urlPath = getDocsUrlPath(filePath);
  if (!urlPath) {
    return result;
  }

  // In this repo, globalReference is optional.
  const referenceId = result.frontMatter.globalReference as string | undefined;
  if (!referenceId) {
    return result;
  }

  const existingReference = references.get(referenceId);
  if (existingReference && existingReference.urlPath !== urlPath) {
    const errorMessage = `the globalReference '${referenceId}' is set in '${existingReference.urlPath}' and '${urlPath}'`;
    if (process.env.NODE_ENV === 'production') {
      throw new Error(errorMessage);
    }
    console.error(
      `[ERROR] ${errorMessage}; if you moved/renamed this file you can ignore this warning`,
    );
    return result;
  }

  // Delete old reference for this url path so renames stay up to date in dev.
  references.forEach((value, key) => {
    if (value.urlPath === urlPath) {
      references.delete(key);
    }
  });

  references.set(referenceId, {
    urlPath,
    title: (result.frontMatter.title as string) ?? '',
    file: filePath,
  });

  return result;
};

export const docRefRemarkPlugin: Plugin = () => {
  return (tree: Node, file) => {
    const refPattern = /ref:([^#)]+)(?:#([^)]+))?/g;

    visit(tree, 'link', (node: {url: string; title?: string} & Literal) => {
      node.url = node.url.replace(
        refPattern,
        (match, referenceId: string, headerId: string) => {
          const reference = references.get(referenceId);

          if (!reference) {
            const errorMessage = `${file.path}:${node.position?.start.line}:${node.position?.start.column}: No reference found for '${referenceId}'`;
            if (process.env.NODE_ENV === 'production') {
              throw new Error(errorMessage);
            }
            console.error(`[ERROR] ${errorMessage}`);
            return match;
          }

          if (file.path === reference.file) {
            const errorMessage = `${file.path}:${node.position?.start.line}:${node.position?.start.column}: Reference '${referenceId}' called in own file`;
            if (process.env.NODE_ENV === 'production') {
              throw new Error(errorMessage);
            }
            console.error(`[ERROR] ${errorMessage}`);
            return match;
          }

          if (!node.title && reference.title) {
            node.title = reference.title;
          }

          return headerId ? `${reference.urlPath}#${headerId}` : reference.urlPath;
        },
      );
    });
  };
};

