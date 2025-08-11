export interface HttpRequest {
    body?: any;
    params?: any;
    query?: any;
    headers?: any;
    user?: any;
}

export interface HttpResponse {
    statusCode: number;
    body: any;
}

export interface Controller {
    handle(httpRequest: HttpRequest): Promise<HttpResponse>
}