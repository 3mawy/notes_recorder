import { useNavigate, useSearchParams } from "react-router-dom";
import Box from "@mui/material/Box";
import { LoadingButton } from "@mui/lab";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Card } from "../components/StyledCard";
import { SignInContainer } from "../components/StyledSigninContainer";
import { useVerify2FACodeMutation } from "../services/authEndpoints";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { login } from "../authSlice";
import { useAppDispatch } from "../../../store/hooks/storeHooks";
import { Form } from "../../../components/form/Form";

const verificationSchema = z.object({
  code: z
    .string()
    .length(6, { message: "2FA code must be exactly 6 digits." })
    .regex(/^[0-9]+$/, { message: "2FA code must be numeric." }),
});

type VerificationFormInputs = z.infer<typeof verificationSchema>;

export default function Verify2FA() {
  const [searchParams] = useSearchParams();
  const [verify2FACode, { isLoading }] = useVerify2FACodeMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const email = searchParams.get("email");

  const form = useForm<VerificationFormInputs>({
    resolver: zodResolver(verificationSchema),
  });
  const { register, formState: { errors } } = form

  const onSubmit = async (data: VerificationFormInputs) => {
    if (email) {
      try {
        const response = await verify2FACode({ email, code: data.code }).unwrap();
        dispatch(
          login({
            user: response.user,
          }),
        );
        navigate("/dashboard");
      } catch (err) {
        console.error("2FA verification failed:", err);
      }
    }
  };

  return (
    <SignInContainer direction="column" justifyContent="space-between">
      <Card variant="outlined">
        <Typography component="h1" variant="h4" sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}>
          Verify 2FA
        </Typography>
        <Typography variant="body2" sx={{ marginBottom: 2 }}>
          Enter the code sent to your email: {email}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 2,
          }}
        >
          <Form form={form} onSubmit={onSubmit}>
            <TextField
              id="2fa-code"
              label="2FA Code"
              required
              fullWidth
              variant="outlined"
              error={!!errors.code}
              helperText={errors.code?.message}
              {...register("code")}
            />
            <LoadingButton
              loading={isLoading}
              type="submit"
              fullWidth
              loadingPosition="start"
              sx={{ backgroundColor: "primary.main", color: "white" }}
              variant="contained"
            >
              Verify
            </LoadingButton>
          </Form>
        </Box>
      </Card>
    </SignInContainer>
  );
}
