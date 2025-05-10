import type { UserFileDTO } from "./UserFileDTO"
import { UserFileDTOFromJSON, UserFileDTOToJSON } from "./UserFileDTO"

/**
 *
 * @export
 * @interface UserFileDTOPagedResponse
 */
export interface UserFileDTOPagedResponse {
  /**
   *
   * @type {number}
   * @memberof UserFileDTOPagedResponse
   */
  page: number
  /**
   *
   * @type {number}
   * @memberof UserFileDTOPagedResponse
   */
  pageSize: number
  /**
   *
   * @type {number}
   * @memberof UserFileDTOPagedResponse
   */
  totalCount: number
  /**
   *
   * @type {Array<UserFileDTO>}
   * @memberof UserFileDTOPagedResponse
   */
  data: Array<UserFileDTO>
}

/**
 * Check if a given object implements the UserFileDTOPagedResponse interface.
 */
export function instanceOfUserFileDTOPagedResponse(value: object): value is UserFileDTOPagedResponse {
  if (!("page" in value) || value["page"] === undefined) return false
  if (!("pageSize" in value) || value["pageSize"] === undefined) return false
  if (!("totalCount" in value) || value["totalCount"] === undefined) return false
  if (!("data" in value) || value["data"] === undefined) return false
  return true
}

export function UserFileDTOPagedResponseFromJSON(json: any): UserFileDTOPagedResponse {
  return UserFileDTOPagedResponseFromJSONTyped(json, false)
}

export function UserFileDTOPagedResponseFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): UserFileDTOPagedResponse {
  if (json == null) {
    return json
  }
  return {
    page: json["page"],
    pageSize: json["pageSize"],
    totalCount: json["totalCount"],
    data: (json["data"] as Array<any>).map(UserFileDTOFromJSON),
  }
}

export function UserFileDTOPagedResponseToJSON(json: any): UserFileDTOPagedResponse {
  return UserFileDTOPagedResponseToJSONTyped(json, false)
}

export function UserFileDTOPagedResponseToJSONTyped(
  value?: UserFileDTOPagedResponse | null,
  ignoreDiscriminator = false,
): any {
  if (value == null) {
    return value
  }

  return {
    page: value["page"],
    pageSize: value["pageSize"],
    totalCount: value["totalCount"],
    data: (value["data"] as Array<any>).map(UserFileDTOToJSON),
  }
}
