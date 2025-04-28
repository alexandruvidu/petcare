import { LoginFormController, LoginFormModel } from "./LoginForm.types";
import { yupResolver } from "@hookform/resolvers/yup";
import { useIntl } from "react-intl";
import * as yup from "yup";
import { isUndefined } from "lodash";
import { useForm } from "react-hook-form";
import { useLogin } from "@infrastructure/apis/api-management";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AppRoute } from "../../../../routes";
import { useAppSelector } from "@application/store";

/**
 * Default form values and validation schema
 */
const getDefaultValues = (initialData?: { email: string }) => {
  const defaultValues = {
    email: "",
    password: ""
  };

  if (!isUndefined(initialData)) {
    return {
      ...defaultValues,
      ...initialData,
    };
  }

  return defaultValues;
};

/**
 * Form validation schema
 */
const useInitLoginForm = () => {
  const { formatMessage } = useIntl();
  const defaultValues = getDefaultValues();

  const schema = yup.object().shape({
    email: yup.string()
      .required(formatMessage(
        { id: "forms.validation.required" },
        {
          fieldName: formatMessage({ id: "forms.fields.email" }),
        }))
      .email(formatMessage({ id: "forms.validation.email" }))
      .default(defaultValues.email),
    password: yup.string()
      .required(formatMessage(
        { id: "forms.validation.required" },
        {
          fieldName: formatMessage({ id: "forms.fields.password" }),
        }))
      .default(defaultValues.password),
  });

  const resolver = yupResolver(schema);

  return { defaultValues, resolver };
};

/**
 * Login form controller hook
 */
export const useLoginFormController = (): LoginFormController => {
  const { formatMessage } = useIntl();
  const { defaultValues, resolver } = useInitLoginForm();
  const navigate = useNavigate();
  const { mutateAsync: login, status } = useLogin();
  const { user } = useAppSelector(state => state.profileReducer);
  
  const submit = useCallback((data: LoginFormModel) => 
    login(data).then((result) => {
      if (result?.user?.role === 'Client') {
        navigate(AppRoute.ClientDashboard);
      } else if (result?.user?.role === 'Sitter') {
        navigate(AppRoute.SitterDashboard);
      } else {
        navigate(AppRoute.Index);
      }
    }), [login, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormModel>({
    defaultValues,
    resolver
  });

  return {
    actions: {
      handleSubmit,
      submit,
      register
    },
    computed: {
      defaultValues,
      isSubmitting: status === "pending"
    },
    state: {
      errors
    }
  };
};