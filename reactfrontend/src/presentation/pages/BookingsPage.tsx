import { WebsiteLayout } from "presentation/layouts/WebsiteLayout"
import { Fragment, memo } from "react"
import { Box } from "@mui/system"
import { Seo } from "@presentation/components/ui/Seo"
import { ContentCard } from "@presentation/components/ui/ContentCard"

export const BookingsPage = memo(() => {
  return (
    <Fragment>
      <Seo title="MobyLab Web App | Bookings" />
      <WebsiteLayout>
        <Box sx={{ padding: "0px 50px 00px 50px", justifyItems: "center" }}>
          <ContentCard>
            <h2 className="text-2xl font-bold mb-4">Bookings</h2>
            <p>This page will display bookings between pet owners and pet sitters.</p>
          </ContentCard>
        </Box>
      </WebsiteLayout>
    </Fragment>
  )
})
