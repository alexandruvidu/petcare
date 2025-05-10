import type { ErrorMessage } from "./ErrorMessage"
import { ErrorMessageFromJSON } from "./ErrorMessage"

/**
 *
 * @export
 * @interface RequestResponse
 */
export interface RequestResponse {
  /**
   *
   * @type {string}
   * @memberof RequestResponse
   */
  readonly response?: string | null
  /**
   *
   * @type {ErrorMessage}
   * @memberof RequestResponse
   */
  readonly errorMessage?: ErrorMessage | null
}

/**
 * Check if a given object implements the RequestResponse interface.
 */
export function instanceOfRequestResponse(value: object): value is RequestResponse {
  return true
}

export function RequestResponseFromJSON(json: any): RequestResponse {
  return RequestResponseFromJSONTyped(json, false)
}

export function RequestResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): RequestResponse {
  if (json == null) {
    return json
  }
  return {
    response: json["response"] == null ? undefined : json["response"],
    errorMessage: json["errorMessage"] == null ? undefined : ErrorMessageFromJSON(json["errorMessage"]),
  }
}

export function RequestResponseToJSON(json: any): RequestResponse {
  return RequestResponseToJSONTyped(json, false)
}

export function RequestResponseToJSONTyped(
  value?: Omit<RequestResponse, "response" | "errorMessage"> | null,
  ignoreDiscriminator = false,
): any {
  if (value == null) {
    return value
  }

  return {}
}
