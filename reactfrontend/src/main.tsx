import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import { CssBaseline, ThemeProvider } from "@mui/material"; // Added ThemeProvider
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageContextProvider } from "@application/context/LanguageContextProvider";
import { BrowserRouter } from "react-router-dom";
import { store } from "@application/store";
import theme from './theme'; // Import the theme
import './index.css'

const queryClient = new QueryClient();

/*
 * This is the entry point of the application, this corresponds to the configuration for injecting multiple services in the application.
 */
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}> {/* Apply the theme */}
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            {/* The Provider adds the storage for Redux. */}
            <Provider store={store}>
                {/* LanguageContextProvider adds the internationalization context for the application to persist the current language. */}
                <LanguageContextProvider>
                    {/* QueryClientProvider adds the query client and internal state. */}
                    <QueryClientProvider client={queryClient}>
                        {/* BrowserRouter adds routing withing the browser. */}
                        <BrowserRouter>
                            {/* Here the actual application contend and logic is added. */}
                            <App />
                        </BrowserRouter>
                    </QueryClientProvider>
                </LanguageContextProvider>
            </Provider>
        </ThemeProvider>
    </React.StrictMode>
)