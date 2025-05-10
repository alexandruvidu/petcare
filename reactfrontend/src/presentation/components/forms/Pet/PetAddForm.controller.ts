"use client"

import type { PetAddFormController, PetAddFormModel } from "./PetAddForm.types"
import { yupResolver } from "@hookform/resolvers/yup"
import { useIntl } from "react-intl"
import * as yup from "yup"
import { isUndefined } from "lodash"
import { useForm } from "react-hook-form"
import { useQueryClient } from "@tanstack/react-query"
import { useAddPet } from "@infrastructure/apis/api-management/pet"
import { useCallback } from "react"
import { toast } from "react-toastify"

/**
 * Use a function to return the default values of the form and the validation schema.
 */
const getDefaultValues = (initialData?: Partial<PetAddFormModel>) => {
  const defaultValues = {
    name: "",
    type: "",
    breed: "",
    age: 0,
    description: "",
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
const useInitPetAddForm = () => {
  const { formatMessage } = useIntl()
  const defaultValues = getDefaultValues()

  const schema = yup.object().shape({
    name: yup
      .string()
      .required(
        formatMessage(
          { id: "globals.validations.requiredField" },
          {
            fieldName: formatMessage({
              id: "globals.name",
            }),
          },
        ),
      )
      .default(defaultValues.name),
    type: yup
      .string()
      .required(
        formatMessage(
          { id: "globals.validations.requiredField" },
          {
            fieldName: formatMessage({
              id: "globals.type",
            }),
          },
        ),
      )
      .default(defaultValues.type),
    breed: yup
      .string()
      .required(
        formatMessage(
          { id: "globals.validations.requiredField" },
          {
            fieldName: formatMessage({
              id: "globals.breed",
            }),
          },
        ),
      )
      .default(defaultValues.breed),
    age: yup
      .number()
      .required(
        formatMessage(
          { id: "globals.validations.requiredField" },
          {
            fieldName: formatMessage({
              id: "globals.age",
            }),
          },
        ),
      )
      .min(0, "Age must be a positive number")
      .default(defaultValues.age),
    description: yup.string().default(defaultValues.description),
  })

  const resolver = yupResolver(schema)

  return { defaultValues, resolver }
}

/**
 * Create a controller hook for the form and return any data that is necessary for the form.
 */
export const usePetAddFormController = (onSuccess?: () => void): PetAddFormController => {
  const { formatMessage } = useIntl()
  const { defaultValues, resolver } = useInitPetAddForm()
  const { mutateAsync: addPet, status } = useAddPet()
  const queryClient = useQueryClient()

  const submit = useCallback(
    (data: PetAddFormModel) => {
      return addPet(data)
        .then(() => {
          toast.success(formatMessage({ id: "notifications.messages.petAdded" }))
          if (onSuccess) {
            onSuccess()
          }
        })
        .catch(() => {
          toast.error(formatMessage({ id: "notifications.errors.petAddFailed" }))
        })
    },
    [addPet, queryClient, formatMessage, onSuccess],
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PetAddFormModel>({
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
