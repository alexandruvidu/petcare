import type { UseFormHandleSubmit, FieldErrors, UseFormRegister } from "react-hook-form"

export type PetAddFormModel = {
  name: string
  type: string
  breed: string
  age: number
  description: string
}

export type PetAddFormController = {
  actions: {
    handleSubmit: UseFormHandleSubmit<PetAddFormModel>
    submit: (data: PetAddFormModel) => Promise<any>
    register: UseFormRegister<PetAddFormModel>
  }
  computed: {
    defaultValues: PetAddFormModel
    isSubmitting: boolean
  }
  state: {
    errors: FieldErrors<PetAddFormModel>
  }
}
