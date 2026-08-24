import { getProfileCookie } from '@/app/actions/auth';
import { redirect } from 'next/navigation';

export default async function SubmittedEntitiesLayout({ children }) {
  const profile = await getProfileCookie();
  
  if (!profile || profile.role !== 'CITIZEN') {
    redirect('/login');
  }

  return <>{children}</>;
}
