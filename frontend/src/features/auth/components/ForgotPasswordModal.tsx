import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useRequestPasswordRecoveryMutation } from "../services/authEndpoints";
import { LoadingButton } from "@mui/lab";
import toast from "../../../utils/toast";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import { Form } from "../../../components/form/Form";

const schema = z.object({
  email: z.string().email("Please enter a valid email address."),
});
type ForgotPassFormInputs = z.infer<typeof schema>;

interface ForgotPasswordProps {
  open: boolean;
  handleClose: () => void;
}

export default function ForgotPasswordModal({ open, handleClose }: ForgotPasswordProps) {
  const [requestPasswordRecovery, { isLoading, isError, error }] = useRequestPasswordRecoveryMutation();

  const form = useForm<ForgotPassFormInputs>({
    resolver: zodResolver(schema),
  });
  const {
    register,
    formState: { errors },
  } = form;

  const onSubmit: SubmitHandler<ForgotPassFormInputs> = async (data) => {
    const response = await requestPasswordRecovery({ email: data.email }).unwrap();
    toast.success({
      title: "Password recovery email sent",
      description: response.detail,
    });
    handleClose();
  };


  const helperText = errors.email ? errors.email.message : isError ? (error as any)?.data?.email : "";

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: { backgroundImage: "none" },
      }}
    >
      <Form form={form} onSubmit={onSubmit} stopPropagation>
        <DialogTitle>Reset password</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
          <DialogContentText>
            Enter your account&apos;s email address, and we&apos;ll send you a link to reset your password.
          </DialogContentText>
          <FormControl>
            <TextField
              required
              margin="dense"
              id="email"
              label="Email address"
              placeholder="Email address"
              type="email"
              fullWidth
              variant="outlined"
              error={!!errors.email || isError} // Indicate error if email validation fails or there is a server error
              helperText={helperText}
              {...register("email")}
            />
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ pb: 3, px: 3 }}>
          <Button onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <LoadingButton
            loading={isLoading}
            type={"submit"}
            loadingPosition="start"
            sx={{ backgroundColor: "primary.main", color: "white" }}
            variant="contained"
          >
            Continue
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
