import { memo, PropsWithChildren } from "react";
import { Navbar } from "../Navbar";
import { Box, Container, Typography } from "@mui/material"; // Removed MuiLink
import { useIntl } from "react-intl";

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
                bgcolor: 'background.default'
            }}
        >
            <Navbar />

            <Container component="main" sx={{ flexGrow: 1, py: {xs: 3, md: 5}, mb: 2 }}>
                {children}
            </Container>

            <Box
                component="footer"
                sx={{
                    py: 3,
                    px: 2,
                    mt: 'auto',
                    backgroundColor: (theme) => theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
                    borderTop: (theme) => `1px solid ${theme.palette.divider}`
                }}
            >
                <Container maxWidth="lg">
                    <Typography variant="body2" color="text.secondary" align="center">
                        {formatMessage({id: "footer.copyright"}, { year: year})}
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
});