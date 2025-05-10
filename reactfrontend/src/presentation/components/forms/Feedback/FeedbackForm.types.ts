import type { UseFormHandleSubmit, FieldErrors, UseFormRegister } from "react-hook-form"

export type FeedbackFormModel = {
  rating: number
  serviceType: string
  comments: string
  wouldRecommend: boolean
}

export type FeedbackFormController = {
  actions: {
    handleSubmit: UseFormHandleSubmit<FeedbackFormModel>
    submit: (data: FeedbackFormModel) => Promise<any>
    register: UseFormRegister<FeedbackFormModel>
  }
  computed: {
    defaultValues: FeedbackFormModel
    isSubmitting: boolean
  }
  state: {
    errors: FieldErrors<FeedbackFormModel>
  }
}
