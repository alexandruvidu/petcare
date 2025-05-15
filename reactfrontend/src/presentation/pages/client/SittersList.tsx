import React, { Fragment, useState, useEffect } from 'react';
import { WebsiteLayout } from "@presentation/layouts/WebsiteLayout";
import { Seo } from "@presentation/components/ui/Seo";
import { useIntl, FormattedMessage } from 'react-intl';
import { Container, Typography, Box, Grid, Card, CardContent, CardActions, Button, TextField, Avatar, Rating, Pagination, Modal, Paper, CircularProgress, Chip } from '@mui/material';
import { useGetAllSitters, useGetMyPets } from '@infrastructure/apis/api-management';
import { UserDTO, SitterProfileDTO, ReviewDTO, PetDTO, UserRoleEnum, Configuration, SitterProfileApi, ReviewApi } from '@infrastructure/apis/client';
import { DataLoadingContainer } from '@presentation/components/ui/LoadingDisplay';
import { Link as RouterLink } from 'react-router-dom';
import { AppRoute } from 'routes';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { BookingForm } from '@presentation/components/forms/Booking/BookingForm';
import { toast } from 'react-toastify';
import { BookingAddFormModel } from '@presentation/components/forms/Booking/BookingForm.types';
import { useQueryClient } from '@tanstack/react-query';
import { useAppSelector } from '@application/store';


const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 500, md: 600 },
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    maxHeight: '90vh',
    overflowY: 'auto'
};

interface SitterWithDetails extends UserDTO {
    profile?: SitterProfileDTO;
    avgRating?: number;
    reviewCount?: number;
}

export const SittersList: React.FC = () => {
    const { formatMessage } = useIntl();
    const { data: sittersData, isLoading: isLoadingSitters, isError: isErrorSitters, refetch: refetchSitters } = useGetAllSitters();
    const { data: petsData, isLoading: isLoadingPets } = useGetMyPets();

    const [allSitters, setAllSitters] = useState<SitterWithDetails[]>([]);
    const [filteredSitters, setFilteredSitters] = useState<SitterWithDetails[]>([]);
    const [selectedSitter, setSelectedSitter] = useState<SitterWithDetails | null>(null);
    const [selectedSitterProfile, setSelectedSitterProfile] = useState<SitterProfileDTO | null>(null);
    const [selectedSitterReviews, setSelectedSitterReviews] = useState<ReviewDTO[]>([]);

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

    const queryClient = useQueryClient();
    const { token } = useAppSelector(x => x.profileReducer);

    useEffect(() => {
        if (sittersData?.response && token) {
            const fetchDetailsForAllSitters = async () => {
                const detailedSittersPromises = sittersData.response!.map(async (sitterUser) => {
                    let profile: SitterProfileDTO | undefined;
                    let avgRating: number | undefined;
                    let reviewCount: number | undefined;

                    try {
                        const profileDataResponse = await queryClient.fetchQuery({
                            queryKey: ["getSitterProfileByIdQuery", token, sitterUser.id],
                            queryFn: () => new SitterProfileApi(new Configuration({ accessToken: token! })).apiSitterProfileGetSitterIdGet({ sitterId: sitterUser.id })
                        });
                        if (profileDataResponse?.response) profile = profileDataResponse.response;

                        const reviewsDataResponse = await queryClient.fetchQuery({
                            queryKey: ["getReviewsForSitterQuery", token, sitterUser.id],
                            queryFn: () => new ReviewApi(new Configuration({ accessToken: token! })).apiReviewGetForSitterSitterIdGet({ sitterId: sitterUser.id })
                        });

                        if (reviewsDataResponse?.response) {
                            const reviews = reviewsDataResponse.response;
                            reviewCount = reviews.length;
                            avgRating = reviews.length > 0 ? reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length : 0;
                        }
                    } catch (e) {
                        console.error(`Error fetching details for sitter ${sitterUser.id}:`, e);
                    }
                    return { ...sitterUser, profile, avgRating, reviewCount };
                });

                try {
                    const detailedSitters = await Promise.all(detailedSittersPromises);
                    const sittersWithCompleteProfiles = detailedSitters.filter(s => s.profile);
                    setAllSitters(sittersWithCompleteProfiles);
                    setFilteredSitters(sittersWithCompleteProfiles);
                } catch (overallError) {
                    console.error("Error fetching details for all sitters:", overallError);
                    setAllSitters([]);
                    setFilteredSitters([]);
                }
            };
            fetchDetailsForAllSitters();
        } else if (!token && sittersData?.response) {
            setAllSitters([]);
            setFilteredSitters([]);
        }
    }, [sittersData, token, queryClient]);


    useEffect(() => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        const filtered = allSitters.filter(sitter =>
            sitter.name?.toLowerCase().includes(lowerSearchTerm) ||
            sitter.profile?.location?.toLowerCase().includes(lowerSearchTerm)
        );
        setFilteredSitters(filtered);
        setCurrentPage(1);
    }, [searchTerm, allSitters]);

    const handleSelectSitter = async (sitter: SitterWithDetails) => {
        setSelectedSitter(sitter);
        setSelectedSitterProfile(sitter.profile || null);
        if (sitter.id && token) {
            try {
                const reviewsRes = await queryClient.fetchQuery({
                    queryKey: ["getReviewsForSitterQuery", token, sitter.id],
                    queryFn: () => new ReviewApi(new Configuration({ accessToken: token! })).apiReviewGetForSitterSitterIdGet({ sitterId: sitter.id })
                });
                setSelectedSitterReviews(reviewsRes?.response || []);
            } catch (e) {
                console.error(`Error fetching reviews for selected sitter ${sitter.id}:`, e);
                setSelectedSitterReviews([]);
            }
        } else {
            setSelectedSitterReviews([]);
        }
    };

    const currentTableData = filteredSitters.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const pageCount = Math.ceil(filteredSitters.length / itemsPerPage);

    const handleOpenBookingModal = () => {
        if (!selectedSitter) return;
        if (!petsData?.response || petsData.response.length === 0) {
            toast.error(formatMessage({id: "client.sitters.noPetsToBook"}));
            return;
        }
        setIsBookingModalOpen(true);
    };
    const handleCloseBookingModal = () => setIsBookingModalOpen(false);


    return (
        <Fragment>
            <Seo title={formatMessage({ id: 'client.sitters.title' })} />
            <WebsiteLayout>
                <Container maxWidth="xl">
                    <Typography variant="h4" component="h1" gutterBottom>
                        <FormattedMessage id="client.sitters.title" />
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
                        <FormattedMessage id="client.sitters.subtitle" />
                    </Typography>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder={formatMessage({ id: 'client.sitters.searchPlaceholder' })}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ mb: 3 }}
                    />
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={selectedSitter ? 7 : 12}>
                            <DataLoadingContainer isLoading={isLoadingSitters && allSitters.length === 0} isError={isErrorSitters} tryReload={refetchSitters}> {/* Adjust isLoading condition */}
                                {currentTableData.length > 0 ? (
                                    <Grid container spacing={2}>
                                        {currentTableData.map(sitter => (
                                            <Grid item xs={12} sm={6} lg={selectedSitter ? 6 : 4} key={sitter.id}>
                                                <Card
                                                    sx={{
                                                        height: '100%', display: 'flex', flexDirection: 'column',
                                                        cursor: 'pointer',
                                                        border: selectedSitter?.id === sitter.id ? 2 : 1,
                                                        borderColor: selectedSitter?.id === sitter.id ? 'primary.main' : 'divider',
                                                        '&:hover': { boxShadow: 6 }
                                                    }}
                                                    onClick={() => handleSelectSitter(sitter)}
                                                >
                                                    <CardContent sx={{ flexGrow: 1 }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                            <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 56, height: 56 }}>{sitter.name?.[0]}</Avatar>
                                                            <Box>
                                                                <Typography variant="h6">{sitter.name}</Typography>
                                                                {sitter.profile?.location && <Typography variant="body2" color="text.secondary" sx={{display: 'flex', alignItems: 'center'}}><LocationOnIcon fontSize="inherit" sx={{mr:0.5}}/> {sitter.profile.location}</Typography>}
                                                            </Box>
                                                        </Box>
                                                        {sitter.avgRating !== undefined && (
                                                            <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                                                                <Rating value={sitter.avgRating} precision={0.1} readOnly size="small" />
                                                                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                                                    ({sitter.reviewCount || 0} <FormattedMessage id="client.sitters.reviewsLink" />)
                                                                </Typography>
                                                            </Box>
                                                        )}
                                                        {sitter.profile?.hourlyRate != null && <Chip label={`${formatMessage({id: "labels.rateSymbol"})}${sitter.profile.hourlyRate} ${formatMessage({id: "client.sitters.hourly"})}`} size="small" icon={<AttachMoneyIcon />} sx={{mr:1, mt:1}}/>}
                                                        {sitter.profile?.yearsExperience != null && <Chip label={`${sitter.profile.yearsExperience} ${formatMessage({id: "client.sitters.years"})}`} size="small" icon={<WorkHistoryIcon />} sx={{mt:1}}/>}
                                                    </CardContent>
                                                    <CardActions sx={{justifyContent: 'flex-end'}}>
                                                        <Button size="small" variant='outlined' onClick={(e) => { e.stopPropagation(); handleSelectSitter(sitter);}}>
                                                            <FormattedMessage id="client.sitters.viewProfile" />
                                                        </Button>
                                                    </CardActions>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                ) : (
                                    !isLoadingSitters && <Typography sx={{textAlign: 'center', mt: 3}}><FormattedMessage id="client.sitters.noSitters" /></Typography>
                                )}
                                {pageCount > 1 && (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                                        <Pagination count={pageCount} page={currentPage} onChange={(_, page) => setCurrentPage(page)} color="primary" />
                                    </Box>
                                )}
                            </DataLoadingContainer>
                        </Grid>
                        {selectedSitter && (
                            <Grid item xs={12} md={5}>
                                <Paper elevation={3} sx={{ p: 3, position: 'sticky', top: (theme) => theme.spacing(10) }}> {/* Increased top spacing */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 64, height: 64, fontSize: '2rem' }}>{selectedSitter.name?.[0]}</Avatar>
                                        <Box>
                                            <Typography variant="h5">{selectedSitter.name}</Typography>
                                            {selectedSitter.avgRating !== undefined && (
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Rating value={selectedSitter.avgRating} precision={0.1} readOnly />
                                                    <Typography variant="body2" component={RouterLink} to={AppRoute.PublicSitterReviews.replace(':sitterId', selectedSitter.id!)} sx={{ ml: 1, textDecoration: 'none' }}>
                                                        ({selectedSitter.reviewCount || 0} <FormattedMessage id="client.sitters.reviewsLink" />)
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Box>
                                    </Box>
                                    {selectedSitterProfile ? (
                                        <>
                                            <Typography variant="subtitle1" gutterBottom fontWeight="bold"><FormattedMessage id="client.sitters.details.bio" /></Typography>
                                            <Typography variant="body2" paragraph sx={{maxHeight: 100, overflowY: 'auto', mb:2, whiteSpace: 'pre-wrap'}}>{selectedSitterProfile.bio}</Typography>

                                            <Grid container spacing={1} sx={{mb:2}}>
                                                <Grid item xs={6}><Typography variant="body2"><strong><FormattedMessage id="client.sitters.details.experience" />:</strong> {selectedSitterProfile.yearsExperience} {formatMessage({id: "client.sitters.years"})}</Typography></Grid>
                                                <Grid item xs={6}><Typography variant="body2"><strong><FormattedMessage id="client.sitters.details.rate" />:</strong> ${selectedSitterProfile.hourlyRate}{formatMessage({id: "client.sitters.hourly"})}</Typography></Grid>
                                                <Grid item xs={12}><Typography variant="body2"><strong><FormattedMessage id="client.sitters.details.location" />:</strong> {selectedSitterProfile.location}</Typography></Grid>
                                            </Grid>

                                            <Typography variant="subtitle1" gutterBottom fontWeight="bold"><FormattedMessage id="client.sitters.details.reviewsTitle" /></Typography>
                                            {selectedSitterReviews.length > 0 ? (
                                                <Box sx={{maxHeight: 150, overflowY: 'auto', border: 1, borderColor: 'divider', p:1, borderRadius:1, mb:2}}>
                                                    {selectedSitterReviews.slice(0,3).map(review =>
                                                        <Box key={review.id} sx={{mb:1, pb:1, borderBottom: 1, borderColor: 'divider', '&:last-child': {borderBottom:0, mb:0, pb:0}}}>
                                                            <Rating value={review.rating} size="small" readOnly/>
                                                            <Typography variant="caption" display="block" color="text.secondary">{review.reviewerName} - {new Date(review.date).toLocaleDateString()}</Typography>
                                                            <Typography variant="body2" sx={{mt:0.5, whiteSpace: 'pre-wrap'}}>{review.comment}</Typography>
                                                        </Box>
                                                    )}
                                                </Box>
                                            ) : <Typography variant="body2" sx={{mb:2}}><FormattedMessage id="client.sitters.details.noReviews" /></Typography>}

                                            <Button fullWidth variant="contained" color="primary" onClick={handleOpenBookingModal} disabled={isLoadingPets}>
                                                <FormattedMessage id="client.sitters.bookNow" />
                                            </Button>
                                        </>
                                    ) : <Box sx={{display:'flex', justifyContent:'center', my:2}}><CircularProgress /></Box> }
                                </Paper>
                            </Grid>
                        )}
                        {!selectedSitter && !isLoadingSitters && filteredSitters.length > 0 && (
                            <Grid item xs={12} md={5}> {/* Ensure this grid item is present */}
                                <Paper elevation={1} sx={{ p: 3, textAlign: 'center', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius:2 }}>
                                    <Typography color="text.secondary"><FormattedMessage id="client.sitters.selectSitterPrompt" /></Typography>
                                </Paper>
                            </Grid>
                        )}
                    </Grid>
                </Container>
            </WebsiteLayout>
            <Modal open={isBookingModalOpen} onClose={handleCloseBookingModal}>
                <Paper sx={modalStyle}>
                    <BookingForm
                        isEdit={false}
                        onSubmitSuccess={() => {
                            handleCloseBookingModal();
                        }}
                        userRole={UserRoleEnum.Client}
                        availablePets={petsData?.response || []}
                        initialData={{ sitterId: selectedSitter?.id || "" } as Partial<BookingAddFormModel>}
                    />
                </Paper>
            </Modal>
        </Fragment>
    );
};