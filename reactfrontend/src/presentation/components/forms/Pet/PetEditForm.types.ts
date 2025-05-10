import type { UseFormHandleSubmit, FieldErrors, UseFormRegister } from "react-hook-form"

export type PetEditFormModel = {
  name: string
  type: string
  breed: string
  age: number
  description: string
}

export type PetEditFormController = {
  actions: {
    handleSubmit: UseFormHandleSubmit<PetEditFormModel>
    submit: (data: PetEditFormModel) => Promise<any>
    register: UseFormRegister<PetEditFormModel>
  }
  computed: {
    defaultValues: PetEditFormModel
    isSubmitting: boolean
    isLoading: boolean
  }
  state: {
    errors: FieldErrors<PetEditFormModel>
  }
}
