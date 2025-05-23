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

import { mapValues } from '../runtime';
import type { BookingDTO } from './BookingDTO';
import {
    BookingDTOFromJSON,
    BookingDTOFromJSONTyped,
    BookingDTOToJSON,
    BookingDTOToJSONTyped,
} from './BookingDTO';
import type { ErrorMessage } from './ErrorMessage';
import {
    ErrorMessageFromJSON,
    ErrorMessageFromJSONTyped,
    ErrorMessageToJSON,
    ErrorMessageToJSONTyped,
} from './ErrorMessage';

/**
 * 
 * @export
 * @interface BookingDTOListRequestResponse
 */
export interface BookingDTOListRequestResponse {
    /**
     * 
     * @type {Array<BookingDTO>}
     * @memberof BookingDTOListRequestResponse
     */
    readonly response?: Array<BookingDTO> | null;
    /**
     * 
     * @type {ErrorMessage}
     * @memberof BookingDTOListRequestResponse
     */
    readonly errorMessage?: ErrorMessage | null;
}

/**
 * Check if a given object implements the BookingDTOListRequestResponse interface.
 */
export function instanceOfBookingDTOListRequestResponse(value: object): value is BookingDTOListRequestResponse {
    return true;
}

export function BookingDTOListRequestResponseFromJSON(json: any): BookingDTOListRequestResponse {
    return BookingDTOListRequestResponseFromJSONTyped(json, false);
}

export function BookingDTOListRequestResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): BookingDTOListRequestResponse {
    if (json == null) {
        return json;
    }
    return {
        
        'response': json['response'] == null ? undefined : ((json['response'] as Array<any>).map(BookingDTOFromJSON)),
        'errorMessage': json['errorMessage'] == null ? undefined : ErrorMessageFromJSON(json['errorMessage']),
    };
}

export function BookingDTOListRequestResponseToJSON(json: any): BookingDTOListRequestResponse {
    return BookingDTOListRequestResponseToJSONTyped(json, false);
}

export function BookingDTOListRequestResponseToJSONTyped(value?: Omit<BookingDTOListRequestResponse, 'response'|'errorMessage'> | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
    };
}

