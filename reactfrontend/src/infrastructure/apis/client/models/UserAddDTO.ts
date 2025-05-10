import type { UserRoleEnum } from "./UserRoleEnum"
import { UserRoleEnumFromJSON, UserRoleEnumToJSON } from "./UserRoleEnum"

/**
 *
 * @export
 * @interface UserAddDTO
 */
export interface UserAddDTO {
  /**
   *
   * @type {string}
   * @memberof UserAddDTO
   */
  name: string
  /**
   *
   * @type {string}
   * @memberof UserAddDTO
   */
  email: string
  /**
   *
   * @type {string}
   * @memberof UserAddDTO
   */
  password: string
  /**
   *
   * @type {UserRoleEnum}
   * @memberof UserAddDTO
   */
  role: UserRoleEnum
}

/**
 * Check if a given object implements the UserAddDTO interface.
 */
export function instanceOfUserAddDTO(value: object): value is UserAddDTO {
  if (!("name" in value) || value["name"] === undefined) return false
  if (!("email" in value) || value["email"] === undefined) return false
  if (!("password" in value) || value["password"] === undefined) return false
  if (!("role" in value) || value["role"] === undefined) return false
  return true
}

export function UserAddDTOFromJSON(json: any): UserAddDTO {
  return UserAddDTOFromJSONTyped(json, false)
}

export function UserAddDTOFromJSONTyped(json: any, ignoreDiscriminator: boolean): UserAddDTO {
  if (json == null) {
    return json
  }
  return {
    name: json["name"],
    email: json["email"],
    password: json["password"],
    role: UserRoleEnumFromJSON(json["role"]),
  }
}

export function UserAddDTOToJSON(json: any): UserAddDTO {
  return UserAddDTOToJSONTyped(json, false)
}

export function UserAddDTOToJSONTyped(value?: UserAddDTO | null, ignoreDiscriminator = false): any {
  if (value == null) {
    return value
  }

  return {
    name: value["name"],
    email: value["email"],
    password: value["password"],
    role: UserRoleEnumToJSON(value["role"]),
  }
}
