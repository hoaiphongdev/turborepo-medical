import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import React, { ReactElement, ReactNode } from 'react';

import 'styles/global.css';

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
  authGuard?: boolean;
};

type ExtendedAppProps = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: ExtendedAppProps) {
  const [queryClient] = React.useState(() => new QueryClient());

  // Get layout
  const getLayout = Component.getLayout ?? ((page) => <>{page}</>);

  return <QueryClientProvider client={queryClient}>{getLayout(<Component {...pageProps} />)}</QueryClientProvider>;
}
