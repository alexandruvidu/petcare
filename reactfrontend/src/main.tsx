import React from "react"
import ReactDOM from "react-dom/client"
import { App } from "./App"
import "./index.css"
import { BrowserRouter } from "react-router-dom"
import { Provider } from "react-redux"
import { store } from "@application/store"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { LanguageContextProvider } from "@application/context/LanguageContextProvider"
import { ToastNotifier } from "@presentation/components/ui/ToastNotifier"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
})

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <LanguageContextProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
          <ToastNotifier />
        </LanguageContextProvider>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>,
)
