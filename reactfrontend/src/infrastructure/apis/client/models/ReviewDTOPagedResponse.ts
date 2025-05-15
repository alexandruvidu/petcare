/* tslint:disable */
/* eslint-disable */
import { mapValues } from '../runtime';
import type { ReviewDTO } from './ReviewDTO';
import { ReviewDTOFromJSON, ReviewDTOToJSON } from './ReviewDTO';

export interface ReviewDTOPagedResponse {
    page?: number;
    pageSize?: number;
    totalCount?: number;
    data?: Array<ReviewDTO> | null;
}
export function ReviewDTOPagedResponseFromJSON(json: any): ReviewDTOPagedResponse {
    return ReviewDTOPagedResponseFromJSONTyped(json, false);
}
export function ReviewDTOPagedResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): ReviewDTOPagedResponse {
    if (json == null) { return json; }
    return {
        'page': json['page'] == null ? undefined : json['page'],
        'pageSize': json['pageSize'] == null ? undefined : json['pageSize'],
        'totalCount': json['totalCount'] == null ? undefined : json['totalCount'],
        'data': json['data'] == null ? undefined : ((json['data'] as Array<any>).map(ReviewDTOFromJSON)),
    };
}
export function ReviewDTOPagedResponseToJSON(value?: ReviewDTOPagedResponse | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) { return value; }
    return {
        'page': value['page'],
        'pageSize': value['pageSize'],
        'totalCount': value['totalCount'],
        'data': value['data'] == null ? undefined : ((value['data'] as Array<any>).map(ReviewDTOToJSON)),
    };
}