import type { UseFormHandleSubmit, FieldErrors, UseFormRegister } from "react-hook-form"

export type RegisterFormModel = {
  name: string
  email: string
  password: string
  confirmPassword: string
  role: number
}

export type RegisterFormController = {
  actions: {
    handleSubmit: UseFormHandleSubmit<RegisterFormModel>
    submit: (data: RegisterFormModel) => Promise<any>
    register: UseFormRegister<RegisterFormModel>
  }
  computed: {
    defaultValues: RegisterFormModel
    isSubmitting: boolean
  }
  state: {
    errors: FieldErrors<RegisterFormModel>
  }
}
