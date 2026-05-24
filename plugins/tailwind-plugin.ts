import type {Plugin} from '@docusaurus/types';

export function tailwindPlugin(): Plugin {
  return {
    name: 'tailwind-plugin',
    configurePostCss(postcssOptions) {
      const plugins = postcssOptions.plugins ?? [];
      if (!plugins.includes('@tailwindcss/postcss')) {
        plugins.push('@tailwindcss/postcss');
      }
      postcssOptions.plugins = plugins;
      return postcssOptions;
    },
  };
}


