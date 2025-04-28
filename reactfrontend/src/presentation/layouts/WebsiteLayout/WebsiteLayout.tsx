import { Navbar } from "../Navbar";
import { Footer } from "../Footer";
import { memo, PropsWithChildren } from "react";
import { Container } from "@mui/material";

/**
 * This component should be used for all pages in the application, it wraps other components in a layout with a navigation bar and a footer.
 */
export const WebsiteLayout = memo(
  (props: PropsWithChildren<{}>) => {
    const { children } = props;

    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow py-8">
          <Container>
            {children}
          </Container>
        </main>
        <Footer />
      </div>
    );
  }
);