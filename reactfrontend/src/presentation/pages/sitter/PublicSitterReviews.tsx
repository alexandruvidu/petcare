import React, { Fragment, useMemo } from 'react';
import { WebsiteLayout } from "@presentation/layouts/WebsiteLayout";
import { Seo } from "@presentation/components/ui/Seo";
import { useIntl, FormattedMessage } from 'react-intl';
import { Container, Typography, Box, Paper, Grid, Rating, Avatar, Button, CircularProgress, Chip } from '@mui/material';
import { useGetReviewsForSitter, useGetUser, useGetSitterProfileById } from '@infrastructure/apis/api-management';
import { DataLoadingContainer } from '@presentation/components/ui/LoadingDisplay';
import { ReviewDTO } from '@infrastructure/apis/client'; // UserDTO, SitterProfileDTO removed as they are fetched
import { dateToDateString } from '@infrastructure/utils/dateUtils';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { AppRoute } from 'routes';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';

export const PublicSitterReviews: React.FC = () => {
    const { formatMessage } = useIntl();
    const { sitterId } = useParams<{ sitterId: string }>();

    const { data: sitterUserData, isLoading: isLoadingUser, isError: isErrorUser } = useGetUser(sitterId ?? null); // Pass null if sitterId is undefined
    const { data: sitterProfileData, isLoading: isLoadingProfile, isError: isErrorProfile } = useGetSitterProfileById(sitterId);
    const { data: reviewsData, isLoading: isLoadingReviews, isError: isErrorReviews, refetch: refetchReviews } = useGetReviewsForSitter(sitterId);

    const sitterName = sitterUserData?.response?.name || formatMessage({ id: "globals.sitter" });

    const averageRating = useMemo(() => {
        if (!reviewsData?.response || reviewsData.response.length === 0) return 0;
        const total = reviewsData.response.reduce((sum, review) => sum + (review.rating || 0), 0);
        return parseFloat((total / reviewsData.response.length).toFixed(1));
    }, [reviewsData]);

    const isLoading = isLoadingUser || isLoadingProfile || isLoadingReviews;
    const isError = isErrorUser || isErrorProfile || isErrorReviews;

    return (
        <Fragment>
            <Seo title={formatMessage({ id: 'publicReviews.title' }, { sitterName })} />
            <WebsiteLayout>
                <Container maxWidth="lg" sx={{py: 3}}>
                    <DataLoadingContainer isLoading={isLoading} isError={isError} tryReload={refetchReviews}>
                        {!sitterUserData?.response && !isLoading ? ( // Check !isLoading also
                            <Typography variant="h5" align="center"><FormattedMessage id="publicReviews.sitterNotFound" /></Typography>
                        ) : sitterUserData?.response ? ( // Only render if sitterUserData.response exists
                            <>
                                <Paper elevation={3} sx={{ p: {xs:2, md:3}, mb: 3 }}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={12} md="auto">
                                            <Avatar sx={{ width: 80, height: 80, fontSize: '2.5rem', bgcolor: 'primary.main' }}>
                                                {sitterName[0]}
                                            </Avatar>
                                        </Grid>
                                        <Grid item xs={12} md>
                                            <Typography variant="h4" component="h1" gutterBottom>
                                                {sitterName}
                                            </Typography>
                                            {sitterProfileData?.response?.location && (
                                                <Typography variant="subtitle1" color="text.secondary" sx={{display: 'flex', alignItems: 'center', mb:1}}>
                                                    <LocationOnIcon fontSize="small" sx={{mr:0.5}}/> {sitterProfileData.response.location}
                                                </Typography>
                                            )}
                                            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb:1 }}>
                                                <Rating value={averageRating} precision={0.1} readOnly />
                                                <Typography variant="body2" color="text.secondary">
                                                    ({averageRating.toFixed(1)} from {reviewsData?.response?.length || 0} <FormattedMessage id="client.sitters.reviewsLink" />)
                                                </Typography>
                                            </Box>
                                            {sitterProfileData?.response && (
                                                <Box sx={{display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1}}>
                                                    <Chip icon={<AttachMoneyIcon />} label={`${formatMessage({id: "labels.rateSymbol"})}${sitterProfileData.response.hourlyRate}${formatMessage({id: "client.sitters.hourly"})}`} size="small"/>
                                                    <Chip icon={<WorkHistoryIcon />} label={`${sitterProfileData.response.yearsExperience} ${formatMessage({id: "client.sitters.years"})}`} size="small"/>
                                                </Box>
                                            )}
                                        </Grid>
                                        <Grid item xs={12} md="auto" sx={{textAlign: {xs: 'left', md:'right'}}}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                size="large"
                                                component={RouterLink}
                                                to={AppRoute.Sitters}
                                            >
                                                <FormattedMessage id="publicReviews.bookThisSitter" values={{sitterName}}/>
                                            </Button>
                                        </Grid>
                                    </Grid>
                                    {sitterProfileData?.response?.bio && (
                                        <Box mt={3} pt={2} borderTop={1} borderColor="divider">
                                            <Typography variant="h6" gutterBottom><FormattedMessage id="publicReviews.aboutSitter" values={{sitterName}}/></Typography>
                                            <Typography variant="body1" sx={{whiteSpace: 'pre-wrap'}}>{sitterProfileData.response.bio}</Typography>
                                        </Box>
                                    )}
                                </Paper>

                                <Typography variant="h5" component="h2" gutterBottom sx={{mt:4, mb:2}}>
                                    <FormattedMessage id="client.sitters.details.reviewsTitle" />
                                </Typography>
                                {reviewsData?.response && reviewsData.response.length > 0 ? (
                                    <Grid container spacing={2}>
                                        {reviewsData.response.map((review: ReviewDTO) => (
                                            <Grid item xs={12} md={6} key={review.id}>
                                                <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1}}>
                                                        <Rating value={review.rating} readOnly />
                                                        <Typography variant="caption" color="text.secondary">
                                                            {dateToDateString(new Date(review.date))}
                                                        </Typography>
                                                    </Box>
                                                    <Typography variant="subtitle2" gutterBottom>
                                                        <FormattedMessage id="sitter.reviews.fromClient" values={{name: review.reviewerName || 'Anonymous'}}/>
                                                    </Typography>
                                                    <Typography variant="body2">{review.comment}</Typography>
                                                </Paper>
                                            </Grid>
                                        ))}
                                    </Grid>
                                ) : (
                                    !isLoadingReviews && <Typography sx={{textAlign: 'center', mt: 3}}><FormattedMessage id="client.sitters.details.noReviews" /></Typography>
                                )}
                            </>
                        ) : null}
                    </DataLoadingContainer>
                </Container>
            </WebsiteLayout>
        </Fragment>
    );
};