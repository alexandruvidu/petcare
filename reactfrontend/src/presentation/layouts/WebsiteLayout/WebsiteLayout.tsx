import { memo, PropsWithChildren } from "react";
import { Navbar } from "./Navbar";
import { Box, Container, Typography } from "@mui/material";

/**
 * This component should be used for all pages in the application,
 * it wraps other components in a layout with a navigation bar and a footer.
 */
export const WebsiteLayout = memo((props: PropsWithChildren<{}>) => {
    const { children } = props;
    const year = new Date().getFullYear();

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
            }}
        >
            <Navbar />

            <Container component="main" sx={{ flexGrow: 1, py: 4, mb: 2 }}>
                {children}
            </Container>

            <Box
                component="footer"
                sx={{
                    py: 3,
                    px: 2,
                    mt: 'auto',
                    backgroundColor: 'grey.100',
                    textAlign: 'center'
                }}
            >
                <Typography variant="body2" color="text.secondary">
                    © {year} PetCare. All rights reserved.
                </Typography>
            </Box>
        </Box>
    );
});