import React, {useMemo, useState, type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import {translate} from '@docusaurus/Translate';
import {PageMetadata} from '@docusaurus/theme-common';
import {useDateTimeFormat} from '@docusaurus/theme-common/internal';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import type {ArchiveBlogPost, Props} from '@theme/BlogArchivePage';

type YearProp = {
  year: string;
  posts: ArchiveBlogPost[];
};

const ALL_YEARS = 'all';
const ALL_TAGS = 'all';

function listPostsByYears(blogPosts: readonly ArchiveBlogPost[]): YearProp[] {
  const postsByYear = blogPosts.reduce((posts, post) => {
    const year = post.metadata.date.split('-')[0] ?? '';
    if (!posts.has(year)) {
      posts.set(year, []);
    }
    posts.get(year)?.push(post);
    return posts;
  }, new Map<string, ArchiveBlogPost[]>());

  return Array.from(postsByYear, ([year, posts]) => ({year, posts})).sort(
    (left, right) => Number(right.year) - Number(left.year),
  );
}

function listAvailableTags(blogPosts: readonly ArchiveBlogPost[]): string[] {
  const tagSet = new Set<string>();
  blogPosts.forEach((post) => {
    post.metadata.tags?.forEach((tag) => {
      tagSet.add(tag.label);
    });
  });
  return Array.from(tagSet).sort();
}

function filterYearsBySelection(years: YearProp[], selectedYear: string): YearProp[] {
  if (selectedYear === ALL_YEARS) {
    return years;
  }

  return years.filter((year) => year.year === selectedYear);
}

function filterPostsByTag(years: YearProp[], selectedTag: string): YearProp[] {
  if (selectedTag === ALL_TAGS) {
    return years;
  }

  return years.map((year) => ({
    ...year,
    posts: year.posts.filter((post) =>
      post.metadata.tags?.some((tag) => tag.label === selectedTag)
    ),
  })).filter((year) => year.posts.length > 0);
}

function ArchiveYear({year, posts}: YearProp) {
  const dateTimeFormat = useDateTimeFormat({
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  });

  return (
    <section className="blog-archive-page__year-group">
      <Heading as="h2" className="blog-archive-page__year">
        {year}
      </Heading>
      <ul className="clean-list blog-archive-page__posts">
        {posts.map((post) => (
          <li key={post.metadata.permalink} className="blog-archive-page__post">
            <Link className="blog-archive-page__link" to={post.metadata.permalink}>
              <span className="blog-archive-page__date">
                {dateTimeFormat.format(new Date(post.metadata.date))}
              </span>
              <span className="blog-archive-page__post-title">{post.metadata.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function BlogArchivePage({archive}: Props): ReactNode {
  const [selectedYear, setSelectedYear] = useState(ALL_YEARS);
  const [selectedTag, setSelectedTag] = useState(ALL_TAGS);
  const title = translate({
    id: 'theme.blog.archive.title',
    message: 'Posts',
    description: 'The page title of the blog archive page',
  });
  const description = translate({
    id: 'theme.blog.archive.description',
    message: 'Posts archive',
    description: 'The page description of the blog archive page',
  });
  const years = useMemo(() => listPostsByYears(archive.blogPosts), [archive.blogPosts]);
  const yearOptions = useMemo(() => years.map((year) => year.year), [years]);
  const visibleYears = useMemo(
    () => filterPostsByTag(filterYearsBySelection(years, selectedYear), selectedTag),
    [selectedYear, selectedTag, years],
  );

  return (
    <>
      <PageMetadata title={title} description={description} />
      <Layout>
        <main className="blog-archive-page">
          <div className="container margin-vert--lg">
            <div className="blog-archive-page__topbar">
              <Heading as="h1" className="blog-archive-page__title">
                {title}
              </Heading>

              <div className="blog-archive-page__controls">
                <Link className="blog-archive-page__tags-button" to="/blog/tags">
                  Browse tags
                </Link>

                <label className="blog-archive-page__filter" htmlFor="blog-archive-year-filter">
                  <span className="blog-archive-page__filter-label">Year</span>
                  <select
                    id="blog-archive-year-filter"
                    className="blog-archive-page__select"
                    value={selectedYear}
                    onChange={(event) => setSelectedYear(event.target.value)}
                  >
                    <option value={ALL_YEARS}>All years</option>
                    {yearOptions.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="blog-archive-page__filter" htmlFor="blog-archive-tag-filter">
                  <span className="blog-archive-page__filter-label">Tag</span>
                  <select
                    id="blog-archive-tag-filter"
                    className="blog-archive-page__select"
                    value={selectedTag}
                    onChange={(event) => setSelectedTag(event.target.value)}
                  >
                    <option value={ALL_TAGS}>All tags</option>
                    {listAvailableTags(archive.blogPosts).map((tag) => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
            {visibleYears.map((year) => (
              <ArchiveYear key={year.year} {...year} />
            ))}
          </div>
        </main>
      </Layout>
    </>
  );
}
