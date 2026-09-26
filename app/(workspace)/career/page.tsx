import { Suspense } from 'react';
import { CareerWorkspace } from '@/components/career/workspace';
export default function Page(){return <Suspense fallback={<p>커리어 공간을 불러오는 중…</p>}><CareerWorkspace/></Suspense>;}
