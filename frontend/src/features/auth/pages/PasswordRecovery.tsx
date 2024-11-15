import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useConfirmPasswordRecoveryMutation } from "../services/authEndpoints";
import { SignInContainer } from "../components/StyledSigninContainer";
import { Card } from "../components/StyledCard";
import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { passwordValidation } from "../services/zodValidation";
import { Form } from "../../../components/form/Form";

const passwordSchema = z.object({
  newPassword: passwordValidation,
  confirmPassword: z.string().min(1, { message: "Please confirm your password." }),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

type PasswordFormInputs = z.infer<typeof passwordSchema>;

export default function ResetPassword() {
  const params = new URLSearchParams(window.location.search);
  const tokenParam = params.get("token") ?? "";
  const navigate = useNavigate();

  const [confirmPasswordRecovery, { isLoading, isError, error }] = useConfirmPasswordRecoveryMutation();

  const form = useForm<PasswordFormInputs>({
    resolver: zodResolver(passwordSchema),
  });
  const { register, formState: { errors } } = form

  const onSubmit = async (data: PasswordFormInputs) => {
    try {
      await confirmPasswordRecovery({
        token: tokenParam,
        new_password: data.newPassword,
        password_confirmation: data.confirmPassword,
      }).unwrap();
      navigate("/auth/login");
    } catch (err) {
      console.error("Password reset failed:", err);
    }
  };

  return (
    <SignInContainer direction="column" justifyContent="space-between">
      <Card variant="outlined">
        <Typography component="h1" variant="h4" sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}>
          Reset Password
        </Typography>
        <Form form={form} onSubmit={onSubmit}>
          <TextField
            error={!!errors.newPassword}
            helperText={errors.newPassword?.message}
            id="newPassword"
            label="New Password"
            type="password"
            autoComplete="new-password"
            required
            fullWidth
            variant="outlined"
            {...register("newPassword")}
          />
          <TextField
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            required
            fullWidth
            variant="outlined"
            {...register("confirmPassword")}
          />
          {isError && <Typography color="error">Error: {(error as any)?.data?.detail}</Typography>}
          <LoadingButton
            loading={isLoading}
            type="submit"
            fullWidth
            loadingPosition="start"
            sx={{ backgroundColor: "primary.main", color: "white" }}
            variant="contained"
          >
            Reset Password
          </LoadingButton>
        </Form>
      </Card>
    </SignInContainer>
  );
}
