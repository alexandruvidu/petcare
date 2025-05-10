import type { UserDTO } from "./UserDTO"
import { UserDTOFromJSON, UserDTOToJSON } from "./UserDTO"

/**
 *
 * @export
 * @interface LoginResponseDTO
 */
export interface LoginResponseDTO {
  /**
   *
   * @type {string}
   * @memberof LoginResponseDTO
   */
  token: string
  /**
   *
   * @type {UserDTO}
   * @memberof LoginResponseDTO
   */
  user: UserDTO
}

/**
 * Check if a given object implements the LoginResponseDTO interface.
 */
export function instanceOfLoginResponseDTO(value: object): value is LoginResponseDTO {
  if (!("token" in value) || value["token"] === undefined) return false
  if (!("user" in value) || value["user"] === undefined) return false
  return true
}

export function LoginResponseDTOFromJSON(json: any): LoginResponseDTO {
  return LoginResponseDTOFromJSONTyped(json, false)
}

export function LoginResponseDTOFromJSONTyped(json: any, ignoreDiscriminator: boolean): LoginResponseDTO {
  if (json == null) {
    return json
  }
  return {
    token: json["token"],
    user: UserDTOFromJSON(json["user"]),
  }
}

export function LoginResponseDTOToJSON(json: any): LoginResponseDTO {
  return LoginResponseDTOToJSONTyped(json, false)
}

export function LoginResponseDTOToJSONTyped(value?: LoginResponseDTO | null, ignoreDiscriminator = false): any {
  if (value == null) {
    return value
  }

  return {
    token: value["token"],
    user: UserDTOToJSON(value["user"]),
  }
}
