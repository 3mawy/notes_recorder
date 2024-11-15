import type { FC } from "react";
import { styled } from "@mui/system";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { useGetUserProfileQuery } from "../services/profileEndpoints";
import Chip from "@mui/material/Chip"; // Import the query hook
import { PageContainer } from "@toolpad/core/PageContainer";

const ProfileField = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  "& .label": {
    fontWeight: 600,
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(0.5),
  },
}));

const ProfilePage: FC = () => {
  const theme = useTheme();

  const { data: userData, error, isLoading } = useGetUserProfileQuery();

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error fetching profile data.</Typography>;

  return (
    <PageContainer title={""}>
      <Box sx={{ width: "100%" }}>
        <Grid>
          {userData && (
            <Grid size={{ xs: 12 }}>
              <Card
                sx={{
                  padding: theme.spacing(3),
                  borderRadius: theme.spacing(1),
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                  marginX: theme.spacing(-3),
                }}
              >
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                    Account Information
                  </Typography>
                  <Chip
                    label={userData.is_active ? "Active" : "Inactive"}
                    color={userData.is_active ? "success" : "error"}
                  />
                </Box>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <ProfileField>
                      <Typography className="label">First Name</Typography>
                      <Typography className="value">{userData.first_name}</Typography>
                    </ProfileField>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <ProfileField>
                      <Typography className="label">Last Name</Typography>
                      <Typography className="value">{userData.last_name}</Typography>
                    </ProfileField>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <ProfileField>
                      <Typography className="label">Email</Typography>
                      <Typography className="value">{userData.email}</Typography>
                    </ProfileField>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          )}
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default ProfilePage;
