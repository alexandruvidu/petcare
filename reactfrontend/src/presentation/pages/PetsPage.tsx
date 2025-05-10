import { WebsiteLayout } from "presentation/layouts/WebsiteLayout"
import { Fragment, memo } from "react"
import { Box } from "@mui/system"
import { Seo } from "@presentation/components/ui/Seo"
import { ContentCard } from "@presentation/components/ui/ContentCard"
import { PetTable } from "@presentation/components/ui/Tables/PetTable"

export const PetsPage = memo(() => {
  return (
    <Fragment>
      <Seo title="MobyLab Web App | Pets" />
      <WebsiteLayout>
        <Box sx={{ padding: "0px 50px 00px 50px", justifyItems: "center" }}>
          <ContentCard>
            <PetTable />
          </ContentCard>
        </Box>
      </WebsiteLayout>
    </Fragment>
  )
})
