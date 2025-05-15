import { useIntl } from "react-intl";
import { useInterceptor } from "@infrastructure/hooks/useInterceptor";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { ErrorResponse } from "@application/models/ErrorResponse";
import { is } from "@infrastructure/utils/typeUtils";
import { useTokenHasExpired } from "@infrastructure/hooks/useOwnUser";
import { ErrorCodes }
    from "@infrastructure/apis/client";
import { ResponseError as OpenApiResponseError } from "@infrastructure/apis/client";

const getTranslationIdForKey = (code?: ErrorCodes) => {
    switch (code) {
        case ErrorCodes.CannotDelete:
            return { id: "notifications.errors.cannotDelete" };
        case ErrorCodes.CannotUpdate:
            return { id: "notifications.errors.cannotUpdate" };
        case ErrorCodes.EntityNotFound:
            return { id: "notifications.errors.entityNotFound" };
        case ErrorCodes.MailSendFailed:
            return { id: "notifications.errors.mailSendFailed" };
        case ErrorCodes.TechnicalError:
            return { id: "notifications.errors.technicalError" };
        case ErrorCodes.AlreadyExists:
            return { id: "notifications.errors.userAlreadyExists" };
        case ErrorCodes.WrongPassword:
            return { id: "notifications.errors.wrongPassword" };
        default:
            return { id: "notifications.errors.unknownHappened" };
    }
};
export const ToastNotifier = () => {
    const { formatMessage } = useIntl();
    const { loggedIn, hasExpired } = useTokenHasExpired();

    useInterceptor({
        async onResponse(response: Response, requestInput: RequestInfo | URL, requestInit?: RequestInit) {
            const requestMethod = requestInit?.method?.toUpperCase() || 'GET';

            if (response.status === 401 && loggedIn && hasExpired) {
                toast.error(formatMessage({ id: "notifications.errors.sessionExpired" }));
            } else if (response.status === 500) {
                toast.error(formatMessage({ id: "notifications.errors.unknownHappened" }));
            } else if (!response.ok && response.headers.has("content-type") && response.headers.get("content-type")?.includes("application/json")) {
                const clonedResponse = response.clone();
                try {
                    const errorBody = await clonedResponse.json();

                    if (errorBody && is<ErrorResponse>(errorBody)) {
                        const urlPath = new URL(response.url).pathname;

                        const isMySitterProfileGet = urlPath.endsWith("/api/SitterProfile/MyProfile") && requestMethod === 'GET';
                        const isPublicSitterProfileGet = urlPath.startsWith("/api/SitterProfile/Get/") && requestMethod === 'GET'; // Added this check
                        const isReviewsForSitterGet = urlPath.startsWith("/api/Review/GetForSitter/") && requestMethod === 'GET';


                        if (errorBody.errorMessage.code === ErrorCodes.EntityNotFound &&
                            (isMySitterProfileGet || isPublicSitterProfileGet || isReviewsForSitterGet )) { // Include the new check here
                            console.warn(`EntityNotFound for ${response.url} (specific GET path), toast suppressed by ToastNotifier.`);
                        } else {
                            toast.error(formatMessage(
                                { id: "notifications.errors.errorMessage" },
                                {
                                    code: formatMessage(getTranslationIdForKey(errorBody.errorMessage.code))
                                }
                            ));
                        }
                    } else {
                        toast.error(formatMessage({ id: "notifications.errors.unknownHappened" }));
                    }
                } catch (jsonError) {
                    console.error("Failed to parse error JSON, but response was not OK:", jsonError);
                    try {
                        const errorText = await response.clone().text();
                        console.error("Error response text:", errorText);
                        if(response.status !== 404) { // Keep original check for non-404s if JSON parsing fails
                            toast.error(formatMessage({ id: "notifications.errors.unknownHappened" }));
                        } else {
                            // For 404s without standard error JSON, now also consider public sitter profile path.
                            const urlPath = new URL(response.url).pathname;
                            const isPublicSitterProfileGet = urlPath.startsWith("/api/SitterProfile/Get/") && requestMethod === 'GET';
                            const isReviewsForSitterGet = urlPath.startsWith("/api/Review/GetForSitter/") && requestMethod === 'GET';

                            if (isPublicSitterProfileGet || isReviewsForSitterGet) {
                                console.warn(`A 404 error occurred for ${response.url} without a standard error JSON body. Toast suppressed (public sitter profile or reviews).`);
                            } else {
                                toast.error(formatMessage({ id: "notifications.errors.unknownHappened" }));
                            }
                        }
                    } catch (textError) {
                        console.error("Failed to get text from error response:", textError);
                        toast.error(formatMessage({ id: "notifications.errors.unknownHappened" }));
                    }
                }
            }
            return response;
        },
        onResponseError(error: any, requestInput: RequestInfo | URL, requestInit?: RequestInit) {
            const requestMethod = requestInit?.method?.toUpperCase() || 'GET';
            if (error instanceof OpenApiResponseError) {
                if (!error.response) {
                    toast.error(formatMessage({ id: "notifications.errors.networkError" }));
                }
                // No need to show generic toast if the response handler above already did or suppressed it
            } else if (typeof error === 'object' && error !== null && 'message' in error && (error.message === 'Failed to fetch' || error.message?.includes('NetworkError'))) {
                toast.error(formatMessage({ id: "notifications.errors.networkError" }));
            } else {
                console.error(`Unhandled/unexpected error in fetch interceptor onResponseError for ${requestMethod} ${requestInput}:`, error);
            }
            throw error;
        }
    });

    return <ToastContainer
        position="top-left"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        theme="light"
        limit={1}
    />
}