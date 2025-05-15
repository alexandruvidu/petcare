type InterceptorPros = {
    onRequest?: (args: [input: RequestInfo | URL, init?: RequestInit | undefined]) => [input: RequestInfo | URL, init?: RequestInit | undefined];
    // Add method to onResponse
    onResponse?: (response: Response, requestInput: RequestInfo | URL, requestInit?: RequestInit) => Response | Promise<Response>;
    onResponseError?: (error: any, requestInput: RequestInfo | URL, requestInit?: RequestInit) => any; // Also add to onError
};

const { fetch: originalFetch } = window;

/**
 * This hook sets the fetch interceptor to intercept HTTP requests and do some additional actions on it.
 */
export const useInterceptor = (props: InterceptorPros) => {
    if (window.fetch === originalFetch) {
        window.fetch = async (...args) => {
            const [resource, config] = props.onRequest ? props.onRequest(args) : args;

            try {
                const response = await originalFetch(resource, config);
                // Pass original request args to onResponse
                return props.onResponse ? props.onResponse(response, resource, config) : response;
            } catch (error: any) {
                // Pass original request args to onResponseError
                throw props.onResponseError ? props.onResponseError(error, resource, config) : error;
            }
        };

        console.log("Fetch interceptor set!");
    }
};