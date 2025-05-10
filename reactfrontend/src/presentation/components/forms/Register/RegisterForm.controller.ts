"use client"

import type { RegisterFormController, RegisterFormModel } from "./RegisterForm.types"
import { yupResolver } from "@hookform/resolvers/yup"
import { useIntl } from "react-intl"
import * as yup from "yup"
import { isUndefined } from "lodash"
import { useForm } from "react-hook-form"
import { useQueryClient } from "@tanstack/react-query"
import { useRegister } from "@infrastructure/apis/api-management/register"
import { useCallback } from "react"
import { useAppRouter } from "@infrastructure/hooks/useAppRouter"
import { toast } from "react-toastify"
import { UserRoleEnum } from "@infrastructure/apis/client"

/**
 * Use a function to return the default values of the form and the validation schema.
 */
const getDefaultValues = (initialData?: { email: string; name: string }) => {
  const defaultValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: UserRoleEnum.User,
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
const useInitRegisterForm = () => {
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
    email: yup
      .string()
      .required(
        formatMessage(
          { id: "globals.validations.requiredField" },
          {
            fieldName: formatMessage({
              id: "globals.email",
            }),
          },
        ),
      )
      .email()
      .default(defaultValues.email),
    password: yup
      .string()
      .required(
        formatMessage(
          { id: "globals.validations.requiredField" },
          {
            fieldName: formatMessage({
              id: "globals.password",
            }),
          },
        ),
      )
      .min(6, formatMessage({ id: "globals.validations.passwordMinLength" }))
      .default(defaultValues.password),
    confirmPassword: yup
      .string()
      .required(
        formatMessage(
          { id: "globals.validations.requiredField" },
          {
            fieldName: formatMessage({
              id: "globals.confirmPassword",
            }),
          },
        ),
      )
      .oneOf([yup.ref("password")], formatMessage({ id: "globals.validations.passwordMatch" }))
      .default(defaultValues.confirmPassword),
    role: yup.number().required().default(defaultValues.role),
  })

  const resolver = yupResolver(schema)

  return { defaultValues, resolver }
}

/**
 * Create a controller hook for the form and return any data that is necessary for the form.
 */
export const useRegisterFormController = (): RegisterFormController => {
  const { formatMessage } = useIntl()
  const { defaultValues, resolver } = useInitRegisterForm()
  const { redirectToLogin } = useAppRouter()
  const { mutateAsync: register, status } = useRegister()
  const queryClient = useQueryClient()

  const submit = useCallback(
    (data: RegisterFormModel) => {
      const registerData = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      }

      return register(registerData).then(() => {
        toast.success(formatMessage({ id: "notifications.messages.registrationSuccess" }))
        redirectToLogin()
      })
    },
    [register, queryClient, redirectToLogin, formatMessage],
  )

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormModel>({
    defaultValues,
    resolver,
  })

  return {
    actions: {
      handleSubmit,
      submit,
      register: registerField,
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
