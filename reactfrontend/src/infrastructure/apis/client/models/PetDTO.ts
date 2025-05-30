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
 * @interface PetDTO
 */
export interface PetDTO {
    /**
     * 
     * @type {string}
     * @memberof PetDTO
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof PetDTO
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof PetDTO
     */
    type: string;
    /**
     * 
     * @type {string}
     * @memberof PetDTO
     */
    breed: string;
    /**
     * 
     * @type {number}
     * @memberof PetDTO
     */
    age: number;
}

/**
 * Check if a given object implements the PetDTO interface.
 */
export function instanceOfPetDTO(value: object): value is PetDTO {
    if (!('id' in value) || value['id'] === undefined) return false;
    if (!('name' in value) || value['name'] === undefined) return false;
    if (!('type' in value) || value['type'] === undefined) return false;
    if (!('breed' in value) || value['breed'] === undefined) return false;
    if (!('age' in value) || value['age'] === undefined) return false;
    return true;
}

export function PetDTOFromJSON(json: any): PetDTO {
    return PetDTOFromJSONTyped(json, false);
}

export function PetDTOFromJSONTyped(json: any, ignoreDiscriminator: boolean): PetDTO {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'],
        'name': json['name'],
        'type': json['type'],
        'breed': json['breed'],
        'age': json['age'],
    };
}

export function PetDTOToJSON(json: any): PetDTO {
    return PetDTOToJSONTyped(json, false);
}

export function PetDTOToJSONTyped(value?: PetDTO | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'id': value['id'],
        'name': value['name'],
        'type': value['type'],
        'breed': value['breed'],
        'age': value['age'],
    };
}

