import React from 'react';
import {Redirect} from '@docusaurus/router';

export default function BlogIndexPage(): React.JSX.Element {
  return <Redirect to="/blog/allPosts" />;
}

