import type {Plugin} from 'unified';
import {visit} from 'unist-util-visit';
import type {Literal, Node} from 'unist';

const repoURL = 'https://github.com/samuel-esp/blog';

export const repoRefRemarkPlugin: Plugin = () => {
  return (tree: Node, file) => {
    const refPattern = /repo(?::([^)]+))?/g;

    visit(tree, 'link', (node: {url: string} & Literal) => {
      node.url = node.url.replace(refPattern, (match, repoPath) => {
        if (!repoPath) {
          const errorMessage = `${file.path}:${node.position?.start.line}:${node.position?.start.column}: No repository path specified`;
          if (process.env.NODE_ENV === 'production') {
            throw new Error(errorMessage);
          }
          console.error(`[ERROR] ${errorMessage}`);
          return match;
        }
        return `${repoURL}/tree/main/${repoPath}`;
      });
    });
  };
};

