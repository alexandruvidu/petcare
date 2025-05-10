/**
 *
 * @export
 * @interface LoginDTO
 */
export interface LoginDTO {
  /**
   *
   * @type {string}
   * @memberof LoginDTO
   */
  email: string
  /**
   *
   * @type {string}
   * @memberof LoginDTO
   */
  password: string
}

/**
 * Check if a given object implements the LoginDTO interface.
 */
export function instanceOfLoginDTO(value: object): value is LoginDTO {
  if (!("email" in value) || value["email"] === undefined) return false
  if (!("password" in value) || value["password"] === undefined) return false
  return true
}

export function LoginDTOFromJSON(json: any): LoginDTO {
  return LoginDTOFromJSONTyped(json, false)
}

export function LoginDTOFromJSONTyped(json: any, ignoreDiscriminator: boolean): LoginDTO {
  if (json == null) {
    return json
  }
  return {
    email: json["email"],
    password: json["password"],
  }
}

export function LoginDTOToJSON(json: any): LoginDTO {
  return LoginDTOToJSONTyped(json, false)
}

export function LoginDTOToJSONTyped(value?: LoginDTO | null, ignoreDiscriminator = false): any {
  if (value == null) {
    return value
  }

  return {
    email: value["email"],
    password: value["password"],
  }
}
