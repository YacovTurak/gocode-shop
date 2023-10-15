import LoadingButton from "@mui/lab/LoadingButton";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    buttonClasses,
    toggleButtonClasses,
} from "@mui/material";
import { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const defaultTheme = createTheme();
const LoadingButtonTheme = createTheme({
    palette: {
        action: {
            disabledBackground: "", // don't set the disable background color
            disabled: "white", // set the disable foreground color
        },
    },
    components: {
        MuiButtonBase: {
            styleOverrides: {
                root: {
                    [`&.${buttonClasses.disabled}`]: {
                        opacity: 0.5,
                    },
                    // Fix ButtonGroup disabled styles.
                    [`&.${toggleButtonClasses.root}.${buttonClasses.disabled}`]:
                        {
                            color: defaultTheme.palette.action.disabled,
                            borderColor:
                                defaultTheme.palette.action.disabledBackground,
                        },
                },
            },
        },
    },
});

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
                    disabled={loading}
                >
                    No
                </Button>
                <ThemeProvider theme={LoadingButtonTheme}>
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
                </ThemeProvider>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;
