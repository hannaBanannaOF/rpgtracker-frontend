'use client';

import { createTheme, MantineColorsTuple, MantineProvider, useMantineColorScheme } from "@mantine/core";
import { QueryClient, QueryClientProvider, isServer } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental';
import { Shell } from "../components/shell/shell";
import { Notifications } from '@mantine/notifications';
import { DatesProvider } from "@mantine/dates";
import { useLocale } from "next-intl";
import 'dayjs/locale/en';
import 'dayjs/locale/pt-BR';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient()
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}

export function Provider({children} : {children: React.ReactNode}) {

  const client = getQueryClient();

  const myColor: MantineColorsTuple = [
    '#e2fff9',
    '#d1f9f1',
    '#a7f1e1',
    '#7aead1',
    '#54e3c3',
    '#3ddfba',
    '#2bddb6',
    '#17c4a0',
    '#00af8d',
    '#009779'
  ];

  const theme = createTheme({
    primaryColor: 'rpgtracker-teal',
    cursorType: 'pointer',
    colors: {
      'rpgtracker-teal': myColor,
    }
  });

  const locale = useLocale();

  return (
      <QueryClientProvider client={client}>
        <ReactQueryStreamedHydration>
          <MantineProvider theme={theme} defaultColorScheme="dark">
            <DatesProvider settings={{ locale: locale }}>
              <Notifications limit={5} />
              <Shell>
                {children}
              </Shell>
            </DatesProvider>
          </MantineProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </ReactQueryStreamedHydration>
      </QueryClientProvider>
  )
}