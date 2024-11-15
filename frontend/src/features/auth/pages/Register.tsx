import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { SignInContainer } from "../components/StyledSigninContainer";
import { Card } from "../components/StyledCard";
import { useRegisterUserMutation } from "../services/authEndpoints";
import type { RegistrationCredentials } from "../services/authTypes";
import { useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import toast from "../../../utils/toast";
import { Form } from "../../../components/form/Form";
import type {ErrorInformation} from "../../../services/types";

const registrationSchema = z.object({
    email: z.string().email("Please enter a valid email address."),
    first_name: z.string().min(1, "Please enter your first name."),
    last_name: z.string().min(1, "Please enter your last name."),
    password: z.string().min(6, "Password must be at least 6 characters."),
});

type RegistrationFormInputs = z.infer<typeof registrationSchema>;

export default function Register() {
    const [registerUserMutation, { isLoading }] = useRegisterUserMutation();
    const navigate = useNavigate();

    const form = useForm<RegistrationFormInputs>({
        resolver: zodResolver(registrationSchema),
    });
    const {
        register,
        formState: { errors },
    } = form;

    const onSubmit = async (data: RegistrationFormInputs) => {
        const { email, first_name, last_name, password } = data;
        const credentials: RegistrationCredentials = { email, first_name, last_name, password };
        try {
            const response = await registerUserMutation(credentials).unwrap();
            navigate(`/auth/login`);
            console.log("Registration successful:", response);
        } catch (err) {
            const error = err as { data: ErrorInformation };
            let description;
            if (error.data?.non_field_errors) {
                description = error.data?.non_field_errors[0] || "";
            }
            toast.error({
                title: "Registration failed",
                description: description,
            });
        }
    };

    return (
        <SignInContainer direction="column" justifyContent="space-between">
            <Card variant="outlined">
                <Typography component="h1" variant="h4" sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}>
                    Register
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
                        <FormLabel htmlFor="first_name">First Name</FormLabel>
                        <TextField
                            error={!!errors.first_name}
                            helperText={errors.first_name ? errors.first_name.message : ""}
                            id="first_name"
                            {...register("first_name")}
                            placeholder="First Name"
                            required
                            fullWidth
                            variant="outlined"
                            color={errors.first_name ? "error" : "primary"}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="last_name">Last Name</FormLabel>
                        <TextField
                            error={!!errors.last_name}
                            helperText={errors.last_name ? errors.last_name.message : ""}
                            id="last_name"
                            {...register("last_name")}
                            placeholder="Last Name"
                            required
                            fullWidth
                            variant="outlined"
                            color={errors.last_name ? "error" : "primary"}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <TextField
                            error={!!errors.password}
                            helperText={errors.password ? errors.password.message : ""}
                            {...register("password")}
                            placeholder="••••••"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                            required
                            fullWidth
                            variant="outlined"
                            color={errors.password ? "error" : "primary"}
                        />
                    </FormControl>
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
                        Register
                    </LoadingButton>
                </Form>
            </Card>
        </SignInContainer>
    );
}


