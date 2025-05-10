"use client"

import type { FeedbackFormController, FeedbackFormModel } from "./FeedbackForm.types"
import { yupResolver } from "@hookform/resolvers/yup"
import { useIntl } from "react-intl"
import * as yup from "yup"
import { isUndefined } from "lodash"
import { useForm } from "react-hook-form"
import { useSubmitFeedback } from "@infrastructure/apis/api-management/feedback"
import { useCallback } from "react"
import { toast } from "react-toastify"

/**
 * Use a function to return the default values of the form and the validation schema.
 */
const getDefaultValues = (initialData?: Partial<FeedbackFormModel>) => {
  const defaultValues = {
    rating: 5,
    serviceType: "",
    comments: "",
    wouldRecommend: true,
  }

  if (!isUndefined(initialData)) {
    return {
      ...defaultValues,
      ...initialData,
    }
  }

  return defaultValues
}

/**
 * Create a hook to get the validation schema.
 */
const useInitFeedbackForm = () => {
  const { formatMessage } = useIntl()
  const defaultValues = getDefaultValues()

  const schema = yup.object().shape({
    rating: yup
      .number()
      .required(
        formatMessage(
          { id: "globals.validations.requiredField" },
          {
            fieldName: formatMessage({
              id: "globals.rating",
            }),
          },
        ),
      )
      .min(1, "Rating must be at least 1")
      .max(5, "Rating must be at most 5")
      .default(defaultValues.rating),
    serviceType: yup
      .string()
      .required(
        formatMessage(
          { id: "globals.validations.requiredField" },
          {
            fieldName: formatMessage({
              id: "feedback.serviceType",
            }),
          },
        ),
      )
      .default(defaultValues.serviceType),
    comments: yup
      .string()
      .required(
        formatMessage(
          { id: "globals.validations.requiredField" },
          {
            fieldName: formatMessage({
              id: "globals.comments",
            }),
          },
        ),
      )
      .default(defaultValues.comments),
    wouldRecommend: yup.boolean().default(defaultValues.wouldRecommend),
  })

  const resolver = yupResolver(schema)

  return { defaultValues, resolver }
}

/**
 * Create a controller hook for the form and return any data that is necessary for the form.
 */
export const useFeedbackFormController = (): FeedbackFormController => {
  const { formatMessage } = useIntl()
  const { defaultValues, resolver } = useInitFeedbackForm()
  const { mutateAsync: submitFeedback, status } = useSubmitFeedback()

  const submit = useCallback(
    (data: FeedbackFormModel) => {
      return submitFeedback(data)
        .then(() => {
          toast.success(formatMessage({ id: "notifications.messages.feedbackSubmitted" }))
          // Reset form after successful submission
          reset(defaultValues)
        })
        .catch(() => {
          toast.error(formatMessage({ id: "notifications.errors.feedbackSubmitFailed" }))
        })
    },
    [submitFeedback, formatMessage],
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FeedbackFormModel>({
    defaultValues,
    resolver,
  })

  return {
    actions: {
      handleSubmit,
      submit,
      register,
    },
    computed: {
      defaultValues,
      isSubmitting: status === "pending",
    },
    state: {
      errors,
    },
  }
}
