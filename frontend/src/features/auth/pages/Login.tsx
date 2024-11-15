import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ForgotPasswordModal from "../components/ForgotPasswordModal";
import { SignInContainer } from "../components/StyledSigninContainer";
import { Card } from "../components/StyledCard";
import { useLoginUserMutation } from "../services/authEndpoints";
import type { LoginCredentials } from "../services/authTypes";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import toast from "../../../utils/toast";
import type { ErrorInformation } from "../../../services/types";
import { Form } from "../../../components/form/Form";
import { useState } from "react";
import { login } from "../authSlice";
import { useAppDispatch } from "../../../store/hooks/storeHooks";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Please enter your password."),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export default function Login() {
  const [open, setOpen] = useState(false);
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const form = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });
  const {
    register,
    formState: { errors },
  } = form;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = async (data: LoginFormInputs) => {
    const { email, password } = data;
    const credentials: LoginCredentials = { email, password };
    try {
      const response = await loginUser(credentials).unwrap();
      if (response.status === "2FA_REQUIRED") {
        navigate(`/auth/verify-2fa?email=${encodeURIComponent(email)}`);
      } else {
        dispatch(
          login({
            user: response?.user,
          }),
        );
        navigate(`/`);
        console.log("Login successful without 2FA:", response);
      }
    } catch (err) {
      const error = err as { data: ErrorInformation };
      let description;
      if (error.data?.non_field_errors) {
        description = error.data?.non_field_errors[0] || "";
      }
      toast.error({
        title: "Login failed",
        description: description,
      });
    }
  };

  return (
    <SignInContainer direction="column" justifyContent="space-between">
      <Card variant="outlined">
        <Typography component="h1" variant="h4" sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}>
          Sign in
        </Typography>
        <Form form={form} onSubmit={onSubmit}>
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
              error={!!errors.email}
              helperText={errors.email ? errors.email.message : ""}
              id="email"
              type="email"
              {...register("email")}
              placeholder="your@email.com"
              autoComplete="email"
              required
              fullWidth
              variant="outlined"
              color={errors.email ? "error" : "primary"}
            />
          </FormControl>
          <FormControl>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Link
                component="button"
                type="button"
                onClick={handleClickOpen}
                variant="body2"
                sx={{ alignSelf: "baseline" }}
              >
                Forgot your password?
              </Link>
            </Box>
            <TextField
              error={!!errors.password}
              helperText={errors.password ? errors.password.message : ""}
              {...register("password")}
              placeholder="••••••"
              type="password"
              id="password"
              autoComplete="current-password"
              required
              fullWidth
              variant="outlined"
              color={errors.password ? "error" : "primary"}
            />
          </FormControl>

          <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
          <ForgotPasswordModal open={open} handleClose={handleClose} />
          <LoadingButton
            loading={isLoading}
            type="submit"
            sx={(theme) => {
              return { backgroundColor: theme.general.logoBg };
            }}
            fullWidth
            loadingPosition="start"
            variant="contained"
          >
            Sign in
          </LoadingButton>
          <RouterLink to={"/auth/register"}>
            or Register.
          </RouterLink>
        </Form>
      </Card>
    </SignInContainer>
  );
}
