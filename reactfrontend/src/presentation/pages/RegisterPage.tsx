import { WebsiteLayout } from "presentation/layouts/WebsiteLayout"
import { Fragment, memo } from "react"
import { Box } from "@mui/system"
import { Seo } from "@presentation/components/ui/Seo"
import { RegisterForm } from "@presentation/components/forms/Register"

export const RegisterPage = memo(() => {
  return (
    <Fragment>
      <Seo title="MobyLab Web App | Register" />
      <WebsiteLayout>
        <Box sx={{ padding: "0px 50px 00px 50px", display: "flex", justifyContent: "center" }}>
          <RegisterForm />
        </Box>
      </WebsiteLayout>
    </Fragment>
  )
})
