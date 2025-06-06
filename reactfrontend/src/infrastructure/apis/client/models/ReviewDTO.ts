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
/**
 * 
 * @export
 * @interface ReviewDTO
 */
export interface ReviewDTO {
    /**
     * 
     * @type {string}
     * @memberof ReviewDTO
     */
    id: string;
    /**
     * 
     * @type {number}
     * @memberof ReviewDTO
     */
    rating: number;
    /**
     * 
     * @type {string}
     * @memberof ReviewDTO
     */
    comment: string;
    /**
     * 
     * @type {Date}
     * @memberof ReviewDTO
     */
    date: Date;
    /**
     * 
     * @type {string}
     * @memberof ReviewDTO
     */
    reviewerId: string;
    /**
     * 
     * @type {string}
     * @memberof ReviewDTO
     */
    reviewerName?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ReviewDTO
     */
    sitterId: string;
    /**
     * 
     * @type {string}
     * @memberof ReviewDTO
     */
    sitterName?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ReviewDTO
     */
    bookingId: string;
}

/**
 * Check if a given object implements the ReviewDTO interface.
 */
export function instanceOfReviewDTO(value: object): value is ReviewDTO {
    if (!('id' in value) || value['id'] === undefined) return false;
    if (!('rating' in value) || value['rating'] === undefined) return false;
    if (!('comment' in value) || value['comment'] === undefined) return false;
    if (!('date' in value) || value['date'] === undefined) return false;
    if (!('reviewerId' in value) || value['reviewerId'] === undefined) return false;
    if (!('sitterId' in value) || value['sitterId'] === undefined) return false;
    if (!('bookingId' in value) || value['bookingId'] === undefined) return false;
    return true;
}

export function ReviewDTOFromJSON(json: any): ReviewDTO {
    return ReviewDTOFromJSONTyped(json, false);
}

export function ReviewDTOFromJSONTyped(json: any, ignoreDiscriminator: boolean): ReviewDTO {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'],
        'rating': json['rating'],
        'comment': json['comment'],
        'date': (new Date(json['date'])),
        'reviewerId': json['reviewerId'],
        'reviewerName': json['reviewerName'] == null ? undefined : json['reviewerName'],
        'sitterId': json['sitterId'],
        'sitterName': json['sitterName'] == null ? undefined : json['sitterName'],
        'bookingId': json['bookingId'],
    };
}

export function ReviewDTOToJSON(json: any): ReviewDTO {
    return ReviewDTOToJSONTyped(json, false);
}

export function ReviewDTOToJSONTyped(value?: ReviewDTO | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'id': value['id'],
        'rating': value['rating'],
        'comment': value['comment'],
        'date': ((value['date']).toISOString()),
        'reviewerId': value['reviewerId'],
        'reviewerName': value['reviewerName'],
        'sitterId': value['sitterId'],
        'sitterName': value['sitterName'],
        'bookingId': value['bookingId'],
    };
}

