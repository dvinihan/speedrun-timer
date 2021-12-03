import "../src/styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import { useState } from "react";
import { ReactQueryDevtools } from "react-query/devtools";
import { AppContextProvider } from "../src/context/AppContext";

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AppContextProvider>
        <Component {...pageProps} />
        <ReactQueryDevtools />
      </AppContextProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
