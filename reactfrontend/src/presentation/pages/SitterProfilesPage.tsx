import { WebsiteLayout } from "presentation/layouts/WebsiteLayout"
import { Fragment, memo } from "react"
import { Box } from "@mui/system"
import { Seo } from "@presentation/components/ui/Seo"
import { ContentCard } from "@presentation/components/ui/ContentCard"
import { SitterProfileTable } from "@presentation/components/ui/Tables/SitterProfileTable"

export const SitterProfilesPage = memo(() => {
  return (
    <Fragment>
      <Seo title="MobyLab Web App | Pet Sitters" />
      <WebsiteLayout>
        <Box sx={{ padding: "0px 50px 00px 50px", justifyItems: "center" }}>
          <ContentCard>
            <SitterProfileTable />
          </ContentCard>
        </Box>
      </WebsiteLayout>
    </Fragment>
  )
})
