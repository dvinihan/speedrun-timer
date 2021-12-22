import "../src/styles/globals.css";
import type { AppProps } from "next/app";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import { useState } from "react";
import { ReactQueryDevtools } from "react-query/devtools";
import { AppContextProvider } from "../src/context/AppContext";

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <AppContextProvider>
          <Component {...pageProps} />
          <ReactQueryDevtools />
        </AppContextProvider>
      </Hydrate>
    </QueryClientProvider>
  );
}

export default MyApp;
