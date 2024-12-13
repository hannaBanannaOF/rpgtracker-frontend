import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { getSessions, MySessions } from "./mysessions";

export default async function MySessionsPage() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['my-sessions'],
    queryFn: getSessions,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MySessions />
    </HydrationBoundary>
    
  );
}