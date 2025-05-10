import type { UserDTO } from "./UserDTO"
import { UserDTOFromJSON, UserDTOToJSON } from "./UserDTO"

/**
 *
 * @export
 * @interface UserDTOPagedResponse
 */
export interface UserDTOPagedResponse {
  /**
   *
   * @type {number}
   * @memberof UserDTOPagedResponse
   */
  page: number
  /**
   *
   * @type {number}
   * @memberof UserDTOPagedResponse
   */
  pageSize: number
  /**
   *
   * @type {number}
   * @memberof UserDTOPagedResponse
   */
  totalCount: number
  /**
   *
   * @type {Array<UserDTO>}
   * @memberof UserDTOPagedResponse
   */
  data: Array<UserDTO>
}

/**
 * Check if a given object implements the UserDTOPagedResponse interface.
 */
export function instanceOfUserDTOPagedResponse(value: object): value is UserDTOPagedResponse {
  if (!("page" in value) || value["page"] === undefined) return false
  if (!("pageSize" in value) || value["pageSize"] === undefined) return false
  if (!("totalCount" in value) || value["totalCount"] === undefined) return false
  if (!("data" in value) || value["data"] === undefined) return false
  return true
}

export function UserDTOPagedResponseFromJSON(json: any): UserDTOPagedResponse {
  return UserDTOPagedResponseFromJSONTyped(json, false)
}

export function UserDTOPagedResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): UserDTOPagedResponse {
  if (json == null) {
    return json
  }
  return {
    page: json["page"],
    pageSize: json["pageSize"],
    totalCount: json["totalCount"],
    data: (json["data"] as Array<any>).map(UserDTOFromJSON),
  }
}

export function UserDTOPagedResponseToJSON(json: any): UserDTOPagedResponse {
  return UserDTOPagedResponseToJSONTyped(json, false)
}

export function UserDTOPagedResponseToJSONTyped(value?: UserDTOPagedResponse | null, ignoreDiscriminator = false): any {
  if (value == null) {
    return value
  }

  return {
    page: value["page"],
    pageSize: value["pageSize"],
    totalCount: value["totalCount"],
    data: (value["data"] as Array<any>).map(UserDTOToJSON),
  }
}
