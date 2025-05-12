import { UserUpdateFormController, UserUpdateFormModel, UserUpdateFormProps } from "./UserUpdateForm.types";
import { yupResolver } from "@hookform/resolvers/yup";
import { useIntl } from "react-intl";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useUpdateUser } from "@infrastructure/apis/api-management"; // Needs to be created
import { useCallback } from "react";
import { toast } from "react-toastify";
import { UserUpdateDTO } from "@infrastructure/apis/client";

// API Hook for User Update (to be placed in infrastructure/apis/api-management/user.ts)
// export const useUpdateUser = () => {
//     const { token } = useAppSelector(x => x.profileReducer);
//     const queryClient = useQueryClient();
//     return useMutation({
//         mutationKey: ["updateUserMutation", token],
//         mutationFn: (userUpdateDTO: UserUpdateDTO) =>
//             new UserApi(new Configuration({ accessToken: token ?? "" })).apiUserUpdatePut({ userUpdateDTO }),
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: [getUserQueryKey] }); // Invalidate GetMe or GetUserById
//             // Potentially update localStorage user data if name/email changes are reflected there
//         },
//     });
// };


const getDefaultValues = (initialData: UserUpdateFormProps['initialData']): UserUpdateFormModel => ({
    name: initialData.name || "",
    email: initialData.email || "",
    phone: initialData.phone || "",
    password: "",
    confirmPassword: "",
});

const useInitUserUpdateForm = (initialData: UserUpdateFormProps['initialData']) => {
    const { formatMessage } = useIntl();
    const defaultValues = getDefaultValues(initialData);

    const schema = yup.object().shape({
        name: yup.string().required(formatMessage({ id: "validation.required" }, { field: formatMessage({ id: "globals.name" }) })),
        email: yup.string().email(formatMessage({ id: "globals.validations.emailInvalid" })).required(formatMessage({ id: "validation.required" }, { field: formatMessage({ id: "globals.email" }) })),
        phone: yup.string().matches(/^\d{10}$/, formatMessage({ id: "globals.validations.phoneInvalid" })).required(formatMessage({ id: "validation.required" }, { field: formatMessage({ id: "globals.phone" }) })),
        password: yup.string().optional().test(
            'password-requirements', // name
            formatMessage({ id: "globals.validations.passwordTooShort" }), // error message
            value => !value || value.length === 0 || value.length >= 6 // validation logic
        ),
        confirmPassword: yup.string().optional()
            .when('password', (password, field) =>
                password && password[0] ? field.required(formatMessage({ id: "globals.validations.requiredField" }, { fieldName: formatMessage({ id: "globals.confirmPassword" }) })).oneOf([yup.ref('password')], formatMessage({ id: "globals.validations.passwordsDoNotMatch" })) : field
            ),
    });
    return { defaultValues, resolver: yupResolver(schema) };
};

export const useUserUpdateFormController = (props: UserUpdateFormProps): UserUpdateFormController => {
    const { initialData, onSubmitSuccess } = props;
    const { formatMessage } = useIntl();
    const { defaultValues, resolver } = useInitUserUpdateForm(initialData);
    const { mutateAsync: updateUser, status } = useUpdateUser();

    const { register, handleSubmit, control, reset, formState: { errors } } = useForm<UserUpdateFormModel>({ defaultValues, resolver });

    const submit = useCallback(async (data: UserUpdateFormModel) => {
        const payload: UserUpdateDTO = {
            name: data.name,
            email: data.email,
            phone: data.phone,
        };
        if (data.password && data.password.length > 0) {
            payload.password = data.password;
        }
        try {
            await updateUser(payload);
            toast.success(formatMessage({ id: "success.profileUpdate" }));

            // Update localStorage if name changed, as Navbar uses it
            const storedUser = localStorage.getItem('user');
            if(storedUser) {
                const userObj = JSON.parse(storedUser);
                userObj.name = data.name;
                userObj.email = data.email; // If email is part of JWT display name
                localStorage.setItem('user', JSON.stringify(userObj));
                window.dispatchEvent(new Event('storage')); // Trigger Navbar update
            }

            reset({ ...data, password: "", confirmPassword: "" }); // Clear password fields
            if (onSubmitSuccess) onSubmitSuccess();
        } catch (error: any) {
            toast.error(error.message || formatMessage({ id: "error.defaultApi" }));
        }
    }, [updateUser, reset, onSubmitSuccess, formatMessage]);

    return {
        actions: { handleSubmit, submit, register, control },
        computed: { isSubmitting: status === "pending" },
        state: { errors },
    };
};