"use client"

import {
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  OutlinedInput,
  Select,
  MenuItem,
  Checkbox,
} from "@mui/material"
import { FormattedMessage, useIntl } from "react-intl"
import { useFeedbackFormController } from "./FeedbackForm.controller"
import { ContentCard } from "@presentation/components/ui/ContentCard"
import { isEmpty, isUndefined } from "lodash"

/**
 * Feedback form component
 */
export const FeedbackForm = () => {
  const { formatMessage } = useIntl()
  const { state, actions, computed } = useFeedbackFormController()

  return (
    <form onSubmit={actions.handleSubmit(actions.submit)}>
      <Stack spacing={4} style={{ width: "100%" }}>
        <ContentCard title={formatMessage({ id: "globals.feedback" })}>
          <div className="grid grid-cols-2 gap-y-5 gap-x-5">
            <div className="col-span-2">
              <FormControl fullWidth error={!isUndefined(state.errors.rating)}>
                <FormLabel required>
                  <FormattedMessage id="globals.rating" />
                </FormLabel>
                <RadioGroup row>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <FormControlLabel
                      key={value}
                      value={value}
                      control={<Radio {...actions.register("rating")} />}
                      label={value}
                    />
                  ))}
                </RadioGroup>
                <FormHelperText hidden={isUndefined(state.errors.rating)}>
                  {state.errors.rating?.message}
                </FormHelperText>
              </FormControl>
            </div>

            <div className="col-span-2">
              <FormControl fullWidth error={!isUndefined(state.errors.serviceType)}>
                <FormLabel required>
                  <FormattedMessage id="feedback.serviceType" />
                </FormLabel>
                <Select {...actions.register("serviceType")} defaultValue="">
                  <MenuItem value="">
                    <em>Select a service type</em>
                  </MenuItem>
                  <MenuItem value="petSitting">Pet Sitting</MenuItem>
                  <MenuItem value="dogWalking">Dog Walking</MenuItem>
                  <MenuItem value="boarding">Boarding</MenuItem>
                  <MenuItem value="daycare">Daycare</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
                <FormHelperText hidden={isUndefined(state.errors.serviceType)}>
                  {state.errors.serviceType?.message}
                </FormHelperText>
              </FormControl>
            </div>

            <div className="col-span-2">
              <FormControl fullWidth error={!isUndefined(state.errors.comments)}>
                <FormLabel required>
                  <FormattedMessage id="globals.comments" />
                </FormLabel>
                <OutlinedInput
                  {...actions.register("comments")}
                  placeholder={formatMessage(
                    { id: "globals.placeholders.textInput" },
                    {
                      fieldName: formatMessage({
                        id: "globals.comments",
                      }),
                    },
                  )}
                  multiline
                  rows={4}
                />
                <FormHelperText hidden={isUndefined(state.errors.comments)}>
                  {state.errors.comments?.message}
                </FormHelperText>
              </FormControl>
            </div>

            <div className="col-span-2">
              <FormControl fullWidth>
                <FormControlLabel
                  control={<Checkbox defaultChecked {...actions.register("wouldRecommend")} />}
                  label={formatMessage({ id: "feedback.wouldRecommend" })}
                />
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
