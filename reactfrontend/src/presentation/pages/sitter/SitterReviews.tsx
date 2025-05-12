import React, { Fragment, useMemo } from 'react';
import { WebsiteLayout } from "@presentation/layouts/WebsiteLayout";
import { Seo } from "@presentation/components/ui/Seo";
import { useIntl, FormattedMessage } from 'react-intl';
import { Container, Typography, Box, Paper, Grid, Rating, Divider } from '@mui/material';
import { useGetReviewsForSitter } from '@infrastructure/apis/api-management';
import { DataLoadingContainer } from '@presentation/components/ui/LoadingDisplay';
import { ReviewDTO } from '@infrastructure/apis/client';
import { dateToDateString } from '@infrastructure/utils/dateUtils';

// i18n
// sitter.reviews.title: "My Reviews"
// sitter.reviews.averageRating: "Average Rating"
// sitter.reviews.totalReviews: "{count} Reviews"
// sitter.reviews.noReviews: "You don't have any reviews yet. Complete bookings to receive feedback!"
// sitter.reviews.fromClient: "From: {name}"

export const SitterReviews: React.FC = () => {
    const { formatMessage } = useIntl();
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : { id: "" };

    const { data: reviewsData, isLoading, isError, refetch } = useGetReviewsForSitter(user.id);

    const averageRating = useMemo(() => {
        if (!reviewsData?.response || reviewsData.response.length === 0) return 0;
        const total = reviewsData.response.reduce((sum, review) => sum + (review.rating || 0), 0);
        return parseFloat((total / reviewsData.response.length).toFixed(1));
    }, [reviewsData]);

    return (
        <Fragment>
            <Seo title={formatMessage({ id: 'sitter.reviews.title' })} />
    <WebsiteLayout>
    <Container maxWidth="md">
    <Typography variant="h4" component="h1" gutterBottom>
    <FormattedMessage id="nav.myReviews" />
        </Typography>
        <DataLoadingContainer isLoading={isLoading} isError={isError} tryReload={refetch}>
    {reviewsData?.response && reviewsData.response.length > 0 ? (
        <>
            <Paper elevation={2} sx={{ p: 3, mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap' }}>
    <Box textAlign="center">
    <Typography variant="overline" color="text.secondary"><FormattedMessage id="sitter.reviews.averageRating" /></Typography>
        <Typography variant="h3" color="primary">{averageRating.toFixed(1)}</Typography>
        <Rating value={averageRating} precision={0.1} readOnly size="large"/>
        </Box>
        <Box textAlign="center">
    <Typography variant="overline" color="text.secondary"><FormattedMessage id="sitter.reviews.totalReviews" values={{count: reviewsData.response.length}} /></Typography>
    <Typography variant="h3">{reviewsData.response.length}</Typography>
        </Box>
        </Paper>
        <Grid container spacing={2}>
        {reviewsData.response.map((review: ReviewDTO) => (
                <Grid item xs={12} key={review.id}>
            <Paper elevation={1} sx={{ p: 2 }}>
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
    </>
) : (
        !isLoading && <Typography sx={{textAlign: 'center', mt: 3}}><FormattedMessage id="sitter.reviews.noReviews" /></Typography>
)}
    </DataLoadingContainer>
    </Container>
    </WebsiteLayout>
    </Fragment>
);
};