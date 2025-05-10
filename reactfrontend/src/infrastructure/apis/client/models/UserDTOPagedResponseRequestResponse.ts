import type { UserDTOPagedResponse } from "./UserDTOPagedResponse"
import { UserDTOPagedResponseFromJSON } from "./UserDTOPagedResponse"
import type { ErrorMessage } from "./ErrorMessage"
import { ErrorMessageFromJSON } from "./ErrorMessage"

/**
 *
 * @export
 * @interface UserDTOPagedResponseRequestResponse
 */
export interface UserDTOPagedResponseRequestResponse {
  /**
   *
   * @type {UserDTOPagedResponse}
   * @memberof UserDTOPagedResponseRequestResponse
   */
  readonly response?: UserDTOPagedResponse | null
  /**
   *
   * @type {ErrorMessage}
   * @memberof UserDTOPagedResponseRequestResponse
   */
  readonly errorMessage?: ErrorMessage | null
}

/**
 * Check if a given object implements the UserDTOPagedResponseRequestResponse interface.
 */
export function instanceOfUserDTOPagedResponseRequestResponse(
  value: object,
): value is UserDTOPagedResponseRequestResponse {
  return true
}

export function UserDTOPagedResponseRequestResponseFromJSON(json: any): UserDTOPagedResponseRequestResponse {
  return UserDTOPagedResponseRequestResponseFromJSONTyped(json, false)
}

export function UserDTOPagedResponseRequestResponseFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): UserDTOPagedResponseRequestResponse {
  if (json == null) {
    return json
  }
  return {
    response: json["response"] == null ? undefined : UserDTOPagedResponseFromJSON(json["response"]),
    errorMessage: json["errorMessage"] == null ? undefined : ErrorMessageFromJSON(json["errorMessage"]),
  }
}

export function UserDTOPagedResponseRequestResponseToJSON(json: any): UserDTOPagedResponseRequestResponse {
  return UserDTOPagedResponseRequestResponseToJSONTyped(json, false)
}

export function UserDTOPagedResponseRequestResponseToJSONTyped(
  value?: Omit<UserDTOPagedResponseRequestResponse, "response" | "errorMessage"> | null,
  ignoreDiscriminator = false,
): any {
  if (value == null) {
    return value
  }

  return {}
}
