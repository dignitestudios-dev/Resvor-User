import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useState } from "react";

const ReactQueryProvider = ({ children }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 5 * 60 * 1000, // 5 minutes
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default ReactQueryProvider;
