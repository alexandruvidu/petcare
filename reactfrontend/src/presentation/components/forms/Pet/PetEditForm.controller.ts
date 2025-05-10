"use client"

import type { PetEditFormController, PetEditFormModel } from "./PetEditForm.types"
import { yupResolver } from "@hookform/resolvers/yup"
import { useIntl } from "react-intl"
import * as yup from "yup"
import { isUndefined } from "lodash"
import { useForm } from "react-hook-form"
import { useQueryClient } from "@tanstack/react-query"
import { useGetPet, useUpdatePet } from "@infrastructure/apis/api-management/pet"
import { useCallback, useEffect } from "react"
import { toast } from "react-toastify"

/**
 * Use a function to return the default values of the form and the validation schema.
 */
const getDefaultValues = (initialData?: Partial<PetEditFormModel>) => {
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
const useInitPetEditForm = () => {
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
export const usePetEditFormController = (petId: string, onSuccess?: () => void): PetEditFormController => {
  const { formatMessage } = useIntl()
  const { defaultValues, resolver } = useInitPetEditForm()
  const { data: petData, isLoading } = useGetPet(petId)
  const { mutateAsync: updatePet, status } = useUpdatePet()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PetEditFormModel>({
    defaultValues,
    resolver,
  })

  useEffect(() => {
    if (petData?.response) {
      reset({
        name: petData.response.name || "",
        type: petData.response.type || "",
        breed: petData.response.breed || "",
        age: petData.response.age || 0,
        description: petData.response.description || "",
      })
    }
  }, [petData, reset])

  const submit = useCallback(
    (data: PetEditFormModel) => {
      return updatePet({ id: petId, petUpdateDTO: data })
        .then(() => {
          toast.success(formatMessage({ id: "notifications.messages.petUpdated" }))
          if (onSuccess) {
            onSuccess()
          }
        })
        .catch(() => {
          toast.error(formatMessage({ id: "notifications.errors.petUpdateFailed" }))
        })
    },
    [updatePet, petId, queryClient, formatMessage, onSuccess],
  )

  return {
    actions: {
      handleSubmit,
      submit,
      register,
    },
    computed: {
      defaultValues,
      isSubmitting: status === "pending",
      isLoading,
    },
    state: {
      errors,
    },
  }
}
