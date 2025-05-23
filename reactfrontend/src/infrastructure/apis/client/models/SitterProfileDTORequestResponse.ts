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
import type { SitterProfileDTO } from './SitterProfileDTO';
import {
    SitterProfileDTOFromJSON,
    SitterProfileDTOFromJSONTyped,
    SitterProfileDTOToJSON,
    SitterProfileDTOToJSONTyped,
} from './SitterProfileDTO';
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
 * @interface SitterProfileDTORequestResponse
 */
export interface SitterProfileDTORequestResponse {
    /**
     * 
     * @type {SitterProfileDTO}
     * @memberof SitterProfileDTORequestResponse
     */
    readonly response?: SitterProfileDTO | null;
    /**
     * 
     * @type {ErrorMessage}
     * @memberof SitterProfileDTORequestResponse
     */
    readonly errorMessage?: ErrorMessage | null;
}

/**
 * Check if a given object implements the SitterProfileDTORequestResponse interface.
 */
export function instanceOfSitterProfileDTORequestResponse(value: object): value is SitterProfileDTORequestResponse {
    return true;
}

export function SitterProfileDTORequestResponseFromJSON(json: any): SitterProfileDTORequestResponse {
    return SitterProfileDTORequestResponseFromJSONTyped(json, false);
}

export function SitterProfileDTORequestResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): SitterProfileDTORequestResponse {
    if (json == null) {
        return json;
    }
    return {
        
        'response': json['response'] == null ? undefined : SitterProfileDTOFromJSON(json['response']),
        'errorMessage': json['errorMessage'] == null ? undefined : ErrorMessageFromJSON(json['errorMessage']),
    };
}

export function SitterProfileDTORequestResponseToJSON(json: any): SitterProfileDTORequestResponse {
    return SitterProfileDTORequestResponseToJSONTyped(json, false);
}

export function SitterProfileDTORequestResponseToJSONTyped(value?: Omit<SitterProfileDTORequestResponse, 'response'|'errorMessage'> | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
    };
}

