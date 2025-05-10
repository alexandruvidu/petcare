import type { ErrorCodes } from "./ErrorCodes"
import { ErrorCodesFromJSON, ErrorCodesToJSON } from "./ErrorCodes"
import type { HttpStatusCode } from "./HttpStatusCode"
import { HttpStatusCodeFromJSON, HttpStatusCodeToJSON } from "./HttpStatusCode"

/**
 *
 * @export
 * @interface ErrorMessage
 */
export interface ErrorMessage {
  /**
   *
   * @type {string}
   * @memberof ErrorMessage
   */
  message: string
  /**
   *
   * @type {ErrorCodes}
   * @memberof ErrorMessage
   */
  code: ErrorCodes
  /**
   *
   * @type {HttpStatusCode}
   * @memberof ErrorMessage
   */
  status: HttpStatusCode
}

/**
 * Check if a given object implements the ErrorMessage interface.
 */
export function instanceOfErrorMessage(value: object): value is ErrorMessage {
  if (!("message" in value) || value["message"] === undefined) return false
  if (!("code" in value) || value["code"] === undefined) return false
  if (!("status" in value) || value["status"] === undefined) return false
  return true
}

export function ErrorMessageFromJSON(json: any): ErrorMessage {
  return ErrorMessageFromJSONTyped(json, false)
}

export function ErrorMessageFromJSONTyped(json: any, ignoreDiscriminator: boolean): ErrorMessage {
  if (json == null) {
    return json
  }
  return {
    message: json["message"],
    code: ErrorCodesFromJSON(json["code"]),
    status: HttpStatusCodeFromJSON(json["status"]),
  }
}

export function ErrorMessageToJSON(json: any): ErrorMessage {
  return ErrorMessageToJSONTyped(json, false)
}

export function ErrorMessageToJSONTyped(value?: ErrorMessage | null, ignoreDiscriminator = false): any {
  if (value == null) {
    return value
  }

  return {
    message: value["message"],
    code: ErrorCodesToJSON(value["code"]),
    status: HttpStatusCodeToJSON(value["status"]),
  }
}
