import { memo, PropsWithChildren } from "react";
import { Navbar } from "../Navbar"; // Updated path
import { Box, Container, Typography } from "@mui/material";
import { useIntl } from "react-intl";

/**
 * This component should be used for all pages in the application,
 * it wraps other components in a layout with a navigation bar and a footer.
 */
export const WebsiteLayout = memo((props: PropsWithChildren<{}>) => {
    const { children } = props;
    const year = new Date().getFullYear();
    const { formatMessage } = useIntl();

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
            }}
        >
            <Navbar />

            <Container component="main" sx={{ flexGrow: 1, py: {xs: 2, md: 4}, mb: 2 }}> {/* Adjusted padding */}
                {children}
            </Container>

            <Box
                component="footer"
                sx={{
                    py: 3,
                    px: 2,
                    mt: 'auto',
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'light'
                            ? theme.palette.grey[200]
                            : theme.palette.grey[800],
                    textAlign: 'center'
                }}
            >
                <Typography variant="body2" color="text.secondary">
                    {formatMessage({id: "footer.copyright"}, { year: year})}
                </Typography>
            </Box>
        </Box>
    );
});