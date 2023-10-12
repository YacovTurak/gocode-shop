import LoadingButton from "@mui/lab/LoadingButton";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import { useState } from "react";

const ConfirmDialog = (props) => {
    const { title, children, open, setOpen, onConfirm } = props;
    const [loading, setLoading] = useState(false);

    return (
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="confirm-dialog"
        >
            <DialogTitle id="confirm-dialog">{title}</DialogTitle>
            <DialogContent>{children}</DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    onClick={() => setOpen(false)}
                    color="secondary"
                >
                    No
                </Button>
                <LoadingButton
                    variant="contained"
                    onClick={() => {
                        // setOpen(false);
                        setLoading(true);
                        onConfirm(setLoading);
                    }}
                    loading={loading}
                    // color="default"
                >
                    Yes
                </LoadingButton>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;
