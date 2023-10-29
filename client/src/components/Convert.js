import { useState } from "react";
import { TextField, toggleButtonClasses } from "@mui/material";
import { buttonClasses } from "@mui/material/Button";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import LoadingButton from "@mui/lab/LoadingButton";
import { AES, enc } from "crypto-js";

const secret = "12345678123456781234567812345678";

export default function Convert() {
    const [image, setImage] = useState({});
    const [loading, setLoading] = useState(false);
    const [loadingDocument, setLoadingDocument] = useState(false);

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
        if (
            image.password !== "81550" ||
            !image.url ||
            image.url === null ||
            image.url === undefined
        ) {
            return;
        }
        const text = image.url;
        const cipherText = AES.encrypt(text, secret);
        const decodedText = cipherText.toString();

        setLoading(true);
        fetch("/api/convert", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ url: decodedText }),
        }).then((response) => {
            response.text().then((data) => {
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

    const loadDocumentHandle = () => {
        if (
            image.password !== "81550" ||
            !image.url ||
            image.url === null ||
            image.url === undefined
        ) {
            return;
        }
        setLoadingDocument(true);
        const text = image.url;
        const cipherText = AES.encrypt(text, secret);
        const decodedText = cipherText.toString();

        fetch("/api/url", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ url: decodedText }),
        }).then((response) => {
            response.text().then((data) => {
                const code = data;
                const bytes = AES.decrypt(code, secret);
                const decrypted = bytes.toString(enc.Utf8);
                console.log(decrypted);
                setLoadingDocument(false);
                setImage({
                    ...image,
                    html: decrypted,
                });
            });
        });
    };

    return (
        <>
            <div>
                <TextField
                    label="Title"
                    fullWidth
                    // sx={{ minWidth: "750px" }}
                    value={image.url}
                    onChange={(e) => {
                        setImage({
                            ...image,
                            url: e.target.value,
                            src: "",
                            html: "",
                        });
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
                <ThemeProvider theme={LoadingButtonTheme}>
                    <LoadingButton
                        onClick={loadDocumentHandle}
                        loading={loadingDocument}
                        variant="contained"
                        disabled={loadingDocument}
                    >
                        <span>load document</span>
                    </LoadingButton>
                </ThemeProvider>
            </div>
            <img key="1" src={image.src} alt="" />
            <iframe
                key={2}
                srcDoc={image.html}
                title="document"
                style={{ width: "800px", height: "1500px" }}
            />
        </>
    );
}
