/* tslint:disable */
/* eslint-disable */
import { mapValues } from '../runtime';
import type { SitterProfileDTO } from './SitterProfileDTO'; // Assuming SitterProfileDTO includes necessary fields or is augmented
import { SitterProfileDTOFromJSON, SitterProfileDTOToJSON } from './SitterProfileDTO';

// For Admin view, SitterProfileDTO might ideally include User's Name, Email, and the Profile ID.
// If SitterProfileDTO is just the profile data, the backend DTO for this paged response should be richer.
// For this simulation, we'll assume SitterProfileDTO itself might have an 'id' and 'userId' or that the backend provides it.
// A more robust solution is a dedicated AdminSitterProfileViewDTO from the backend.

export interface SitterProfileDTOPagedResponse {
    page?: number;
    pageSize?: number;
    totalCount?: number;
    data?: Array<SitterProfileDTO & { id: string; userId: string; userName?: string; userEmail?: string; }> | null; // Augmenting for admin view
}
export function SitterProfileDTOPagedResponseFromJSON(json: any): SitterProfileDTOPagedResponse {
    return SitterProfileDTOPagedResponseFromJSONTyped(json, false);
}
export function SitterProfileDTOPagedResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): SitterProfileDTOPagedResponse {
    if (json == null) { return json; }
    return {
        'page': json['page'] == null ? undefined : json['page'],
        'pageSize': json['pageSize'] == null ? undefined : json['pageSize'],
        'totalCount': json['totalCount'] == null ? undefined : json['totalCount'],
        'data': json['data'] == null ? undefined : ((json['data'] as Array<any>).map(SitterProfileDTOFromJSON as any)), // Cast as any due to augmentation
    };
}
export function SitterProfileDTOPagedResponseToJSON(value?: SitterProfileDTOPagedResponse | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) { return value; }
    return {
        'page': value['page'],
        'pageSize': value['pageSize'],
        'totalCount': value['totalCount'],
        'data': value['data'] == null ? undefined : ((value['data'] as Array<any>).map(SitterProfileDTOToJSON as any)), // Cast as any
    };
}