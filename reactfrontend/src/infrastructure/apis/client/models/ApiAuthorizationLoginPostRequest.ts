/**
 *
 * @export
 * @interface ApiAuthorizationLoginPostRequest
 */
export interface ApiAuthorizationLoginPostRequest {
  /**
   *
   * @type {string}
   * @memberof ApiAuthorizationLoginPostRequest
   */
  email: string
  /**
   *
   * @type {string}
   * @memberof ApiAuthorizationLoginPostRequest
   */
  password: string
}

/**
 * Check if a given object implements the ApiAuthorizationLoginPostRequest interface.
 */
export function instanceOfApiAuthorizationLoginPostRequest(value: object): boolean {
  let isInstance = true
  isInstance = isInstance && "email" in value
  isInstance = isInstance && "password" in value

  return isInstance
}

export function ApiAuthorizationLoginPostRequestFromJSON(json: any): ApiAuthorizationLoginPostRequest {
  return ApiAuthorizationLoginPostRequestFromJSONTyped(json, false)
}

export function ApiAuthorizationLoginPostRequestFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): ApiAuthorizationLoginPostRequest {
  if (json === undefined || json === null) {
    return json
  }
  return {
    email: json["email"],
    password: json["password"],
  }
}

export function ApiAuthorizationLoginPostRequestToJSON(value?: ApiAuthorizationLoginPostRequest | null): any {
  if (value === undefined) {
    return undefined
  }
  if (value === null) {
    return null
  }
  return {
    email: value.email,
    password: value.password,
  }
}
