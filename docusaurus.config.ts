import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import {tailwindPlugin} from './plugins/tailwind-plugin';
import {
  docRefRemarkPlugin,
  globalRefParseFrontMatter,
} from './plugins/global-ref-plugin';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import {repoRefRemarkPlugin} from './plugins/repo-ref-plugin';
import {
  firstDocRedirectPlugin,
  type Config as FirstDocRedirectConfig,
} from './plugins/first-doc-redirect';

const config: Config = {
  title: 'Samuel Esposito',
  tagline: 'Cloud Engineer | Platform Engineer | Kubernetes',
  favicon: 'img/favicon-32x32.png',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  url: 'https://samuel-esposito.dev',
  baseUrl: '/',
  organizationName: 'samuel-esp', // Usually your GitHub org/user name.
  projectName: 'blog', // Usually your repo name.

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
      type: 'text/css',
      integrity:
          'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
      crossorigin: 'anonymous',
    },
  ],
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          beforeDefaultRemarkPlugins: [docRefRemarkPlugin, repoRefRemarkPlugin],
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          routeBasePath: 'blog', // Serve blog at /blog
          archiveBasePath: 'allPosts',
          tagsBasePath: 'tags',
          blogTitle: "Samuel Esposito Blog",
          blogDescription: "Samuel Esposito - Cloud Engineer & Platform Engineer",
          postsPerPage: "ALL",
          onInlineTags: 'throw',
          onInlineAuthors: 'throw',
          onUntruncatedBlogPosts: 'throw',
          blogSidebarTitle: 'Recent Posts',
          blogSidebarCount: 5,
          beforeDefaultRemarkPlugins: [repoRefRemarkPlugin],
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.8,
          ignorePatterns: [
            "blog/tags",
            "blog/tags/**",
            "blog/archive",
            "blog/tags/**",
          ],
          filename: 'sitemap.xml',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    tailwindPlugin,
    [
      firstDocRedirectPlugin,
      {sidebarConfig: 'sidebars.ts'} satisfies FirstDocRedirectConfig,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/profile.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Samuel Esposito',
      logo: {
        alt: 'Samuel Esposito Profile Picture',
        src: 'img/profile.jpg',
      },
      items: [
          /*
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'CNCF Certifcations',
        },*/
        {to: '/blog', label: 'Blog', position: 'left'},
        {to: '/blog/allPosts', label: 'All Posts', position: 'left'},
        /*{to: '/blog/allPosts', label: 'CNCF Certifications Guides', position: 'left'},*/
        {
          href: 'https://github.com/samuel-esp',
          position: 'right',
          className: 'navbar-github-link',
          'aria-label': 'GitHub',
        },
        {
          href: 'https://www.linkedin.com/in/samuel-esposito-016036115/',
          position: 'right',
          className: 'navbar-linkedin-link',
          'aria-label': 'LinkedIn',
        },
        {
          href: 'https://samuel-esposito.dev/blog/rss.xml',
          position: 'right',
          className: 'navbar-rss-link',
          'aria-label': 'RSS Feed',
        },
      ],
    },
    announcementBar: {
      id: 'share_posts',
      content: '📢 Enjoying the content? Share my posts on social media to help others discover insights on Kubernetes, Cloud Engineering & Platform Engineering!',
      backgroundColor: '#fafbfc',
      textColor: '#091E42',
      isCloseable: true,
    },
    footer: {
      style: 'dark',
      copyright: `Copyright © ${new Date().getFullYear()} Samuel Esposito`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.oneDark,
      additionalLanguages: ['bash'],
      magicComments: [
        {
          className: "theme-code-block-highlighted-line",
          line: "highlight-next-line",
          block: { start: "highlight-start", end: "highlight-end" },
        },
      ],
    },
  } satisfies Preset.ThemeConfig,
  headTags: [
    // Global Open Graph tags
    {
      tagName: 'meta',
      attributes: {
        property: 'og:type',
        content: 'website',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:site_name',
        content: 'Samuel Esposito',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:image:width',
        content: '1280',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:image:height',
        content: '640',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:image:alt',
        content: 'Samuel Esposito - Cloud Engineer & Platform Engineer',
      },
    },
    // Global Twitter Card type
    {
      tagName: 'meta',
      attributes: {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
    },
    // Preconnect for Google Fonts
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'anonymous',
      },
    },
    // Speed up DNS/TLS setup for the primary origin serving static images
    {
      tagName: 'link',
      attributes: {
        rel: 'dns-prefetch',
        href: 'https://samuel-esposito.dev',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://samuel-esposito.dev',
      },
    },
    // Person schema
    {
      tagName: 'script',
      attributes: {
        type: 'application/ld+json',
      },
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        '@id': 'https://samuel-esposito.dev/#person',
        name: 'Samuel Esposito',
        url: 'https://samuel-esposito.dev/',
        description: 'Cloud Engineer | Platform Engineer | Kubernetes Expert',
        jobTitle: 'Cloud & Platform Engineer',
        sameAs: [
          'https://github.com/samuel-esp',
          'https://www.linkedin.com/in/samuel-esposito-016036115/',
        ],
        knowsAbout: [
          'Kubernetes',
          'Cloud Engineering',
          'Platform Engineering',
          'DevOps',
          'Cloud Cost Optimization',
          'Kubernetes Operators',
          'Infrastructure as Code',
          'Observability',
          'SRE',
          'Automation',
          'Go (Golang)',
          'Open Source',
        ],
      }),
    },
    // Website schema
    {
      tagName: 'script',
      attributes: {
        type: 'application/ld+json',
      },
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': 'https://samuel-esposito.dev/#website',
        name: 'Samuel Esposito',
        url: 'https://samuel-esposito.dev/',
        description: 'Cloud Engineer | Platform Engineer | Kubernetes',
        publisher: { '@id': 'https://samuel-esposito.dev/#person' },
      }),
    },
  ],
  markdown: {
    parseFrontMatter: globalRefParseFrontMatter,
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },
};

export default config;
