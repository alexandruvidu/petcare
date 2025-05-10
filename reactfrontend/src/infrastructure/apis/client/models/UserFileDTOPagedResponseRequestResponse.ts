import type { UserFileDTOPagedResponse } from "./UserFileDTOPagedResponse"
import { UserFileDTOPagedResponseFromJSON } from "./UserFileDTOPagedResponse"
import type { ErrorMessage } from "./ErrorMessage"
import { ErrorMessageFromJSON } from "./ErrorMessage"

/**
 *
 * @export
 * @interface UserFileDTOPagedResponseRequestResponse
 */
export interface UserFileDTOPagedResponseRequestResponse {
  /**
   *
   * @type {UserFileDTOPagedResponse}
   * @memberof UserFileDTOPagedResponseRequestResponse
   */
  readonly response?: UserFileDTOPagedResponse | null
  /**
   *
   * @type {ErrorMessage}
   * @memberof UserFileDTOPagedResponseRequestResponse
   */
  readonly errorMessage?: ErrorMessage | null
}

/**
 * Check if a given object implements the UserFileDTOPagedResponseRequestResponse interface.
 */
export function instanceOfUserFileDTOPagedResponseRequestResponse(
  value: object,
): value is UserFileDTOPagedResponseRequestResponse {
  return true
}

export function UserFileDTOPagedResponseRequestResponseFromJSON(json: any): UserFileDTOPagedResponseRequestResponse {
  return UserFileDTOPagedResponseRequestResponseFromJSONTyped(json, false)
}

export function UserFileDTOPagedResponseRequestResponseFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): UserFileDTOPagedResponseRequestResponse {
  if (json == null) {
    return json
  }
  return {
    response: json["response"] == null ? undefined : UserFileDTOPagedResponseFromJSON(json["response"]),
    errorMessage: json["errorMessage"] == null ? undefined : ErrorMessageFromJSON(json["errorMessage"]),
  }
}

export function UserFileDTOPagedResponseRequestResponseToJSON(json: any): UserFileDTOPagedResponseRequestResponse {
  return UserFileDTOPagedResponseRequestResponseToJSONTyped(json, false)
}

export function UserFileDTOPagedResponseRequestResponseToJSONTyped(
  value?: Omit<UserFileDTOPagedResponseRequestResponse, "response" | "errorMessage"> | null,
  ignoreDiscriminator = false,
): any {
  if (value == null) {
    return value
  }

  return {}
}
