import type { ErrorMessage } from "./ErrorMessage"
import { ErrorMessageFromJSON } from "./ErrorMessage"
import type { LoginResponseDTO } from "./LoginResponseDTO"
import { LoginResponseDTOFromJSON } from "./LoginResponseDTO"

/**
 *
 * @export
 * @interface LoginResponseDTORequestResponse
 */
export interface LoginResponseDTORequestResponse {
  /**
   *
   * @type {LoginResponseDTO}
   * @memberof LoginResponseDTORequestResponse
   */
  readonly response?: LoginResponseDTO | null
  /**
   *
   * @type {ErrorMessage}
   * @memberof LoginResponseDTORequestResponse
   */
  readonly errorMessage?: ErrorMessage | null
}

/**
 * Check if a given object implements the LoginResponseDTORequestResponse interface.
 */
export function instanceOfLoginResponseDTORequestResponse(value: object): value is LoginResponseDTORequestResponse {
  return true
}

export function LoginResponseDTORequestResponseFromJSON(json: any): LoginResponseDTORequestResponse {
  return LoginResponseDTORequestResponseFromJSONTyped(json, false)
}

export function LoginResponseDTORequestResponseFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): LoginResponseDTORequestResponse {
  if (json == null) {
    return json
  }
  return {
    response: json["response"] == null ? undefined : LoginResponseDTOFromJSON(json["response"]),
    errorMessage: json["errorMessage"] == null ? undefined : ErrorMessageFromJSON(json["errorMessage"]),
  }
}

export function LoginResponseDTORequestResponseToJSON(json: any): LoginResponseDTORequestResponse {
  return LoginResponseDTORequestResponseToJSONTyped(json, false)
}

export function LoginResponseDTORequestResponseToJSONTyped(
  value?: Omit<LoginResponseDTORequestResponse, "response" | "errorMessage"> | null,
  ignoreDiscriminator = false,
): any {
  if (value == null) {
    return value
  }

  return {}
}
