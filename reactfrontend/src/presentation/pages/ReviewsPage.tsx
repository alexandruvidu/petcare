import { WebsiteLayout } from "presentation/layouts/WebsiteLayout"
import { Fragment, memo } from "react"
import { Box } from "@mui/system"
import { Seo } from "@presentation/components/ui/Seo"
import { ContentCard } from "@presentation/components/ui/ContentCard"

export const ReviewsPage = memo(() => {
  return (
    <Fragment>
      <Seo title="MobyLab Web App | Reviews" />
      <WebsiteLayout>
        <Box sx={{ padding: "0px 50px 00px 50px", justifyItems: "center" }}>
          <ContentCard>
            <h2 className="text-2xl font-bold mb-4">Reviews</h2>
            <p>This page will display reviews for pet sitters.</p>
          </ContentCard>
        </Box>
      </WebsiteLayout>
    </Fragment>
  )
})
