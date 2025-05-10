import { WebsiteLayout } from "presentation/layouts/WebsiteLayout"
import { Fragment, memo } from "react"
import { Box } from "@mui/system"
import { Seo } from "@presentation/components/ui/Seo"
import { FeedbackForm } from "@presentation/components/forms/Feedback"

export const FeedbackPage = memo(() => {
  return (
    <Fragment>
      <Seo title="MobyLab Web App | Feedback" />
      <WebsiteLayout>
        <Box sx={{ padding: "0px 50px 00px 50px", display: "flex", justifyContent: "center" }}>
          <FeedbackForm />
        </Box>
      </WebsiteLayout>
    </Fragment>
  )
})
