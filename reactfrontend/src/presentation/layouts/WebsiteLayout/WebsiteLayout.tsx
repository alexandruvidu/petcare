import { memo, PropsWithChildren, useState } from "react"; // Added useState
import { Navbar } from "../Navbar";
import { Box, Container, Typography, Link as MuiLink, Button } from "@mui/material"; // Added Button
import { useIntl, FormattedMessage } from "react-intl";
import { FeedbackDialog } from "@presentation/components/ui/Dialogs/FeedbackDialog/FeedbackDialog"; // Added
import FeedbackIcon from '@mui/icons-material/Feedback'; // Added

export const WebsiteLayout = memo((props: PropsWithChildren<{}>) => {
    const { children } = props;
    const year = new Date().getFullYear();
    const { formatMessage } = useIntl();
    const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);

    const handleOpenFeedbackDialog = () => setIsFeedbackDialogOpen(true);
    const handleCloseFeedbackDialog = () => setIsFeedbackDialogOpen(false);

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
                <Container maxWidth="lg" sx={{display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2}}>
                    <Typography variant="body2" color="text.secondary" align="center" sx={{flexGrow: 1}}>
                        {formatMessage({id: "footer.copyright"}, { year: year})}
                    </Typography>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<FeedbackIcon />}
                        onClick={handleOpenFeedbackDialog}
                        sx={{ color: 'text.secondary', borderColor: 'text.secondary', '&:hover': { borderColor: 'text.primary', backgroundColor: 'action.hover'} }}
                    >
                        <FormattedMessage id="footer.feedbackButton" />
                    </Button>
                </Container>
            </Box>
            <FeedbackDialog isOpen={isFeedbackDialogOpen} onClose={handleCloseFeedbackDialog} />
        </Box>
    );
});