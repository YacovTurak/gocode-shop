import { useState } from "react";
import { TextField, toggleButtonClasses } from "@mui/material";
import { buttonClasses } from "@mui/material/Button";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import LoadingButton from "@mui/lab/LoadingButton";
import { AES, enc } from "crypto-js";

export default function Convert() {
    const [image, setImage] = useState({});
    const [loading, setLoading] = useState(false);

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
                                    defaultTheme.palette.action
                                        .disabledBackground,
                            },
                    },
                },
            },
        },
    });

    const sendHandle = () => {
        if (image.password !== "81550") {
            return;
        }
        setLoading(true);
        fetch("/api/convert", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ url: image.url }),
        }).then((response) => {
            response.text().then((data) => {
                const secret = "12345678123456781234567812345678";
                const code = data;
                const bytes = AES.decrypt(code, secret);
                const decrypted = bytes.toString(enc.Utf8);
                setLoading(false);
                setImage({
                    ...image,
                    src: decrypted,
                });
            });
        });
    };

    return (
        <div>
            <TextField
                label="Title"
                fullWidth
                // sx={{ minWidth: "750px" }}
                value={image.url}
                onChange={(e) => {
                    setImage({ ...image, url: e.target.value, src: "" });
                }}
            />
            <TextField
                label="Title"
                fullWidth
                // sx={{ minWidth: "750px" }}
                type="password"
                value={image.password}
                onChange={(e) => {
                    setImage({ ...image, password: e.target.value });
                }}
            />
            <ThemeProvider theme={LoadingButtonTheme}>
                <LoadingButton
                    onClick={sendHandle}
                    loading={loading}
                    variant="contained"
                    disabled={loading}
                >
                    <span>Save</span>
                </LoadingButton>
            </ThemeProvider>
            <img key="1" src={image.src} alt="" />
        </div>
    );
}
