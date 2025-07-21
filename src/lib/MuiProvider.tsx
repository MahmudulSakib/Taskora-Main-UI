"use client";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { muiTheme } from "./theme";

export default function MuiProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
