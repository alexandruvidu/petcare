"use client"

import {
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  FormLabel,
  Stack,
  OutlinedInput,
  TextField,
} from "@mui/material"
import { FormattedMessage, useIntl } from "react-intl"
import { usePetEditFormController } from "./PetEditForm.controller"
import { ContentCard } from "@presentation/components/ui/ContentCard"
import { isEmpty, isUndefined } from "lodash"
import { DataLoading } from "@presentation/components/ui/LoadingDisplay"

/**
 * Pet edit form component
 */
export const PetEditForm = ({ petId, onSuccess }: { petId: string; onSuccess?: () => void }) => {
  const { formatMessage } = useIntl()
  const { state, actions, computed } = usePetEditFormController(petId, onSuccess)

  if (computed.isLoading) {
    return <DataLoading />
  }

  return (
    <form onSubmit={actions.handleSubmit(actions.submit)}>
      <Stack spacing={4} style={{ width: "100%" }}>
        <ContentCard title={formatMessage({ id: "globals.edit" }) + " " + formatMessage({ id: "globals.pet" })}>
          <div className="grid grid-cols-2 gap-y-5 gap-x-5">
            <div className="col-span-2">
              <FormControl fullWidth error={!isUndefined(state.errors.name)}>
                <FormLabel required>
                  <FormattedMessage id="globals.name" />
                </FormLabel>
                <OutlinedInput
                  {...actions.register("name")}
                  placeholder={formatMessage(
                    { id: "globals.placeholders.textInput" },
                    {
                      fieldName: formatMessage({
                        id: "globals.name",
                      }),
                    },
                  )}
                />
                <FormHelperText hidden={isUndefined(state.errors.name)}>{state.errors.name?.message}</FormHelperText>
              </FormControl>
            </div>

            <div className="col-span-1">
              <FormControl fullWidth error={!isUndefined(state.errors.type)}>
                <FormLabel required>
                  <FormattedMessage id="globals.type" />
                </FormLabel>
                <OutlinedInput
                  {...actions.register("type")}
                  placeholder={formatMessage(
                    { id: "globals.placeholders.textInput" },
                    {
                      fieldName: formatMessage({
                        id: "globals.type",
                      }),
                    },
                  )}
                />
                <FormHelperText hidden={isUndefined(state.errors.type)}>{state.errors.type?.message}</FormHelperText>
              </FormControl>
            </div>

            <div className="col-span-1">
              <FormControl fullWidth error={!isUndefined(state.errors.breed)}>
                <FormLabel required>
                  <FormattedMessage id="globals.breed" />
                </FormLabel>
                <OutlinedInput
                  {...actions.register("breed")}
                  placeholder={formatMessage(
                    { id: "globals.placeholders.textInput" },
                    {
                      fieldName: formatMessage({
                        id: "globals.breed",
                      }),
                    },
                  )}
                />
                <FormHelperText hidden={isUndefined(state.errors.breed)}>{state.errors.breed?.message}</FormHelperText>
              </FormControl>
            </div>

            <div className="col-span-1">
              <FormControl fullWidth error={!isUndefined(state.errors.age)}>
                <FormLabel required>
                  <FormattedMessage id="globals.age" />
                </FormLabel>
                <TextField
                  type="number"
                  {...actions.register("age")}
                  placeholder={formatMessage(
                    { id: "globals.placeholders.textInput" },
                    {
                      fieldName: formatMessage({
                        id: "globals.age",
                      }),
                    },
                  )}
                  InputProps={{ inputProps: { min: 0 } }}
                />
                <FormHelperText hidden={isUndefined(state.errors.age)}>{state.errors.age?.message}</FormHelperText>
              </FormControl>
            </div>

            <div className="col-span-2">
              <FormControl fullWidth error={!isUndefined(state.errors.description)}>
                <FormLabel>
                  <FormattedMessage id="globals.description" />
                </FormLabel>
                <OutlinedInput
                  {...actions.register("description")}
                  placeholder={formatMessage(
                    { id: "globals.placeholders.textInput" },
                    {
                      fieldName: formatMessage({
                        id: "globals.description",
                      }),
                    },
                  )}
                  multiline
                  rows={4}
                />
                <FormHelperText hidden={isUndefined(state.errors.description)}>
                  {state.errors.description?.message}
                </FormHelperText>
              </FormControl>
            </div>

            <Button
              className="-col-end-1 col-span-1"
              type="submit"
              disabled={!isEmpty(state.errors) || computed.isSubmitting}
            >
              {!computed.isSubmitting && <FormattedMessage id="globals.submit" />}
              {computed.isSubmitting && <CircularProgress />}
            </Button>
          </div>
        </ContentCard>
      </Stack>
    </form>
  )
}
