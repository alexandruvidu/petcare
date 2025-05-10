import type { UserRoleEnum } from "@infrastructure/apis/client"
import type { FormController } from "../FormController"
import type { UseFormHandleSubmit, UseFormRegister, FieldErrorsImpl, DeepRequired, UseFormWatch } from "react-hook-form"
import type { SelectChangeEvent } from "@mui/material"

export type UserAddFormModel = {
  name: string
  email: string
  password: string
  role: UserRoleEnum
}

export type UserAddFormState = {
  errors: FieldErrorsImpl<DeepRequired<UserAddFormModel>>
}

export type UserAddFormActions = {
  register: UseFormRegister<UserAddFormModel>
  watch: UseFormWatch<UserAddFormModel>
  handleSubmit: UseFormHandleSubmit<UserAddFormModel>
  submit: (body: UserAddFormModel) => void
  selectRole: (value: SelectChangeEvent<UserRoleEnum>) => void
}
export type UserAddFormComputed = {
  defaultValues: UserAddFormModel
  isSubmitting: boolean
}

export type UserAddFormController = FormController<UserAddFormState, UserAddFormActions, UserAddFormComputed>
