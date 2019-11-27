import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import { useWorkspaces } from '../lib/hooks';
import { useRouter } from 'next/router';
import { useAppContext } from '../lib/context';
import WorkspaceSelector from '../components/WorkspaceSelector';

const Home = () => {
  const { workspaceId, setWorkspaceId } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (workspaceId) {
      setWorkspaceId(workspaceId);
      router.push('/projects', `/w/${workspaceId}`, { query: { workspaceId } });
    }
  }, [workspaceId]);

  if (!workspaceId) {
    return (
      <Navigation>
        <WorkspaceSelector open={true} onClose={() => {}} />
      </Navigation>
    );
  }
  return <Navigation />;
};

export default Home;
