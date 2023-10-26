import { useEffect, useState } from "react";
import {
    Autocomplete,
    Box,
    Button,
    MenuItem,
    TextField,
    toggleButtonClasses,
} from "@mui/material";
import { buttonClasses } from "@mui/material/Button";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import LoadingButton from "@mui/lab/LoadingButton";
import { AES, enc } from "crypto-js";

// const { decrypt } = require("./crypto1");
// const crypto = require("crypto");

// const mykey = crypto.createDecipher("aes-128-cbc", "mypassword");
// let mystr = mykey.update("34feb914c099df25794bf9ccb85bea72", "hex", "utf8");
// mystr += mykey.final("utf8");

// console.log(mystr);

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
        console.log(JSON.stringify({ url: image.url }));
        setLoading(true);
        fetch("/api/convert", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ url: image.url }),
        }).then((response) => {
            // setImage({ ...image, srcaa: response });
            response.text().then((res) => {
                const secret = "12345678123456781234567812345678";
                // const code = "U2FsdGVkX1/3jQRuyaXyKQjpzEQ38ub6Dm6ZJ9aFrqM=";
                const code = res;
                const bytes = AES.decrypt(code, secret);
                console.log("bytes", bytes);
                const decrypted = bytes.toString(enc.Utf8);
                console.log("decrypted", decrypted);

                // const data = decrypt(res);
                // console.log("TCL: sendHandle -> data", data);
            });
            //     console.log(srcbb.part1);
            //     console.log(srcbb.part2);
            //     console.log("textLength", srcbb.textLength);
            //     const fullSrc = srcbb.part1 + srcbb.part2;
            //     console.log('<img src="' + fullSrc + '">');
            //     setLoading(false);
            //     setImage({
            //         ...image,
            //         srcaa: fullSrc,
            //     });
            // });
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
                    setImage({ ...image, url: e.target.value });
                }}
            />
            <textarea value={image.src} />
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
            <img key="1" src={image.srcaa} alt="" />
        </div>
    );
}
