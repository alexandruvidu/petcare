/* tslint:disable */
/* eslint-disable */
import { mapValues } from '../runtime';
import type { BookingDTO } from './BookingDTO';
import { BookingDTOFromJSON, BookingDTOToJSON } from './BookingDTO';

export interface BookingDTOPagedResponse {
    page?: number;
    pageSize?: number;
    totalCount?: number;
    data?: Array<BookingDTO> | null;
}
export function BookingDTOPagedResponseFromJSON(json: any): BookingDTOPagedResponse {
    return BookingDTOPagedResponseFromJSONTyped(json, false);
}
export function BookingDTOPagedResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): BookingDTOPagedResponse {
    if (json == null) { return json; }
    return {
        'page': json['page'] == null ? undefined : json['page'],
        'pageSize': json['pageSize'] == null ? undefined : json['pageSize'],
        'totalCount': json['totalCount'] == null ? undefined : json['totalCount'],
        'data': json['data'] == null ? undefined : ((json['data'] as Array<any>).map(BookingDTOFromJSON)),
    };
}
export function BookingDTOPagedResponseToJSON(value?: BookingDTOPagedResponse | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) { return value; }
    return {
        'page': value['page'],
        'pageSize': value['pageSize'],
        'totalCount': value['totalCount'],
        'data': value['data'] == null ? undefined : ((value['data'] as Array<any>).map(BookingDTOToJSON)),
    };
}