'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const githubAppSlug = 'portfolio-creator';
interface SearchParams {
    access_token?: string;
    login?: string;
}

export default function InstallApp({ searchParams} : {searchParams: SearchParams}) {
  const router = useRouter();
  const { access_token, login } = searchParams;

  useEffect(() => {
    if (access_token && login) {
      window.location.href = `https://github.com/apps/${githubAppSlug}/installations/new`;
    } else {
      router.push('/');
    }
  }, [access_token, login, router]);

  return <div>Redirecting to install GitHub App...</div>;
}
