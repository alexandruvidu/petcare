import type { UserDTO } from "./UserDTO"
import { UserDTOFromJSON } from "./UserDTO"
import type { ErrorMessage } from "./ErrorMessage"
import { ErrorMessageFromJSON } from "./ErrorMessage"

/**
 *
 * @export
 * @interface UserDTORequestResponse
 */
export interface UserDTORequestResponse {
  /**
   *
   * @type {UserDTO}
   * @memberof UserDTORequestResponse
   */
  readonly response?: UserDTO | null
  /**
   *
   * @type {ErrorMessage}
   * @memberof UserDTORequestResponse
   */
  readonly errorMessage?: ErrorMessage | null
}

/**
 * Check if a given object implements the UserDTORequestResponse interface.
 */
export function instanceOfUserDTORequestResponse(value: object): value is UserDTORequestResponse {
  return true
}

export function UserDTORequestResponseFromJSON(json: any): UserDTORequestResponse {
  return UserDTORequestResponseFromJSONTyped(json, false)
}

export function UserDTORequestResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): UserDTORequestResponse {
  if (json == null) {
    return json
  }
  return {
    response: json["response"] == null ? undefined : UserDTOFromJSON(json["response"]),
    errorMessage: json["errorMessage"] == null ? undefined : ErrorMessageFromJSON(json["errorMessage"]),
  }
}

export function UserDTORequestResponseToJSON(json: any): UserDTORequestResponse {
  return UserDTORequestResponseToJSONTyped(json, false)
}

export function UserDTORequestResponseToJSONTyped(
  value?: Omit<UserDTORequestResponse, "response" | "errorMessage"> | null,
  ignoreDiscriminator = false,
): any {
  if (value == null) {
    return value
  }

  return {}
}
