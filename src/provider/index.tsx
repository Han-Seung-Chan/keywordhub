import { ReactNode } from "react";

import { QueryProvider } from "@/provider/react-query-provider";
import { ThemeProvider } from "@/provider/theme-provider";

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="right"
        enableSystem
        disableTransitionOnChange
      >
        <QueryProvider>{children}</QueryProvider>
      </ThemeProvider>
    </>
  );
};
