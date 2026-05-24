import React from 'react';
import {Redirect} from '@docusaurus/router';
import {useActiveVersion, useDocsData} from '@docusaurus/plugin-content-docs/client';

type Props = {
  sidebar: string;
};

export default function FirstDocRedirect({sidebar}: Props): React.JSX.Element {
  const docsData = useDocsData(undefined);
  const activeVersion = useActiveVersion(undefined) ?? docsData.versions[0];

  const fallbackPath = activeVersion?.path ?? '/docs';
  const sidebarLink = activeVersion?.sidebars?.[sidebar]?.link?.path;

  return <Redirect to={sidebarLink ?? fallbackPath} />;
}

