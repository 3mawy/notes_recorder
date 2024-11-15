import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import type { BooleanCallback } from "../../../utils/utilTypes";
import type { JSX } from "react";

export default function ConfirmationDialog(props: {
  isConfirmationOpen: boolean;
  setConfirmationOpen: BooleanCallback;
  setConfirmed: BooleanCallback;
  dialogText: JSX.Element;
}) {
  const handleNo = () => {
    props.setConfirmed(false);
    props.setConfirmationOpen(false);
  };
  const handleYes = () => {
    props.setConfirmed(true);
    props.setConfirmationOpen(false);
  };

  return (
    <Dialog open={props.isConfirmationOpen} onClose={handleNo} data-testid="confirmation-dialog">
      <DialogTitle>Confirm</DialogTitle>
      <DialogContent>{props.dialogText}</DialogContent>
      <DialogActions>
        <Button onClick={handleNo} variant={"outlined"} data-testid="confirmation-dialog-no-button">
          No
        </Button>
        <Button onClick={handleYes} variant={"contained"} color={"error"} data-testid="confirmation-dialog-yes-button">
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
