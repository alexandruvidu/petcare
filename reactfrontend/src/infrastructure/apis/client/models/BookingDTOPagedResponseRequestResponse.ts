/* tslint:disable */
/* eslint-disable */
import { mapValues } from '../runtime';
import type { BookingDTOPagedResponse } from './BookingDTOPagedResponse';
import { BookingDTOPagedResponseFromJSON, BookingDTOPagedResponseToJSON } from './BookingDTOPagedResponse';
import type { ErrorMessage } from './ErrorMessage';
import { ErrorMessageFromJSON, ErrorMessageToJSON } from './ErrorMessage';

export interface BookingDTOPagedResponseRequestResponse {
    readonly response?: BookingDTOPagedResponse | null;
    readonly errorMessage?: ErrorMessage | null;
}
export function BookingDTOPagedResponseRequestResponseFromJSON(json: any): BookingDTOPagedResponseRequestResponse {
    return BookingDTOPagedResponseRequestResponseFromJSONTyped(json, false);
}
export function BookingDTOPagedResponseRequestResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): BookingDTOPagedResponseRequestResponse {
    if (json == null) { return json; }
    return {
        'response': json['response'] == null ? undefined : BookingDTOPagedResponseFromJSON(json['response']),
        'errorMessage': json['errorMessage'] == null ? undefined : ErrorMessageFromJSON(json['errorMessage']),
    };
}
export function BookingDTOPagedResponseRequestResponseToJSON(value?: Omit<BookingDTOPagedResponseRequestResponse, 'response'|'errorMessage'> | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) { return value; }
    return {};
}