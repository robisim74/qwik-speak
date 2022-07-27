// Get the headers (that will return in endpointResponse)
export const getHeaders = (request: any) => {
    const cookie = request.headers?.get('cookie') ?? undefined;
    const acceptLanguage = request.headers?.get('accept-language') ?? undefined;

    return {
        status: 200,
        headers: {
            cookie: cookie,
            acceptLanguage: acceptLanguage
        }
    };
}
