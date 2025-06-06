/* tslint:disable */
/* eslint-disable */
/**
 * MobyLab Web App
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: v1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import * as runtime from '../runtime';
import type {
  RequestResponse,
  ReviewAddDTO,
  ReviewDTOListRequestResponse,
  ReviewDTORequestResponse,
  ReviewUpdateDTO,
} from '../models/index';
import {
    RequestResponseFromJSON,
    RequestResponseToJSON,
    ReviewAddDTOFromJSON,
    ReviewAddDTOToJSON,
    ReviewDTOListRequestResponseFromJSON,
    ReviewDTOListRequestResponseToJSON,
    ReviewDTORequestResponseFromJSON,
    ReviewDTORequestResponseToJSON,
    ReviewUpdateDTOFromJSON,
    ReviewUpdateDTOToJSON,
} from '../models/index';

export interface ApiReviewAddPostRequest {
    reviewAddDTO?: ReviewAddDTO;
}

export interface ApiReviewDeleteIdDeleteRequest {
    id: string;
}

export interface ApiReviewGetByBookingBookingIdGetRequest {
    bookingId: string;
}

export interface ApiReviewGetForSitterSitterIdGetRequest {
    sitterId: string;
}

export interface ApiReviewUpdateIdPutRequest {
    id: string;
    reviewUpdateDTO?: ReviewUpdateDTO;
}

/**
 * 
 */
export class ReviewApi extends runtime.BaseAPI {

    /**
     */
    async apiReviewAddPostRaw(requestParameters: ApiReviewAddPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<RequestResponse>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/Review/Add`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ReviewAddDTOToJSON(requestParameters['reviewAddDTO']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => RequestResponseFromJSON(jsonValue));
    }

    /**
     */
    async apiReviewAddPost(requestParameters: ApiReviewAddPostRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<RequestResponse> {
        const response = await this.apiReviewAddPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async apiReviewDeleteIdDeleteRaw(requestParameters: ApiReviewDeleteIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<RequestResponse>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiReviewDeleteIdDelete().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/Review/Delete/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id']))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => RequestResponseFromJSON(jsonValue));
    }

    /**
     */
    async apiReviewDeleteIdDelete(requestParameters: ApiReviewDeleteIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<RequestResponse> {
        const response = await this.apiReviewDeleteIdDeleteRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async apiReviewGetByBookingBookingIdGetRaw(requestParameters: ApiReviewGetByBookingBookingIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ReviewDTORequestResponse>> {
        if (requestParameters['bookingId'] == null) {
            throw new runtime.RequiredError(
                'bookingId',
                'Required parameter "bookingId" was null or undefined when calling apiReviewGetByBookingBookingIdGet().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/Review/GetByBooking/{bookingId}`.replace(`{${"bookingId"}}`, encodeURIComponent(String(requestParameters['bookingId']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ReviewDTORequestResponseFromJSON(jsonValue));
    }

    /**
     */
    async apiReviewGetByBookingBookingIdGet(requestParameters: ApiReviewGetByBookingBookingIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ReviewDTORequestResponse> {
        const response = await this.apiReviewGetByBookingBookingIdGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async apiReviewGetForSitterSitterIdGetRaw(requestParameters: ApiReviewGetForSitterSitterIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ReviewDTOListRequestResponse>> {
        if (requestParameters['sitterId'] == null) {
            throw new runtime.RequiredError(
                'sitterId',
                'Required parameter "sitterId" was null or undefined when calling apiReviewGetForSitterSitterIdGet().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/Review/GetForSitter/{sitterId}`.replace(`{${"sitterId"}}`, encodeURIComponent(String(requestParameters['sitterId']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ReviewDTOListRequestResponseFromJSON(jsonValue));
    }

    /**
     */
    async apiReviewGetForSitterSitterIdGet(requestParameters: ApiReviewGetForSitterSitterIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ReviewDTOListRequestResponse> {
        const response = await this.apiReviewGetForSitterSitterIdGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async apiReviewUpdateIdPutRaw(requestParameters: ApiReviewUpdateIdPutRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<RequestResponse>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling apiReviewUpdateIdPut().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/Review/Update/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id']))),
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ReviewUpdateDTOToJSON(requestParameters['reviewUpdateDTO']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => RequestResponseFromJSON(jsonValue));
    }

    /**
     */
    async apiReviewUpdateIdPut(requestParameters: ApiReviewUpdateIdPutRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<RequestResponse> {
        const response = await this.apiReviewUpdateIdPutRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
