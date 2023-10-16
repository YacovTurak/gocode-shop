import {
    Autocomplete,
    Box,
    Button,
    MenuItem,
    TextField,
    toggleButtonClasses,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useContext, useState } from "react";
import MyContext from "../../MyContext";
import "./AddProduct.css";
import { useLocation, useNavigate } from "react-router-dom";
import { buttonClasses } from "@mui/material/Button";
import { createTheme, ThemeProvider } from "@mui/material/styles";

function AddProduct() {
    // המוצר החדש להוספה
    const [product, setProduct] = useState({});
    // הצגת ספינר בלחצן השמירה
    const [loading, setLoading] = useState(false);
    const { categories, products, setProducts, setShortMessage } =
        useContext(MyContext);

    // גישה לניווט בהיסטוריה
    const location = useLocation();
    const navigate = useNavigate();
    // חזור אחורה
    const goBack = () => {
        // אם היה דף קודם - חזור אחורה, אם לא - עבור לדף הבית
        if (location.key !== "default") {
            navigate(-1);
        } else {
            navigate("/");
        }
    };

    // בעת שמירה
    const saveHandle = () => {
        setLoading(true);
        // שמור בשרת
        fetch("/api/products", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(product),
        }).then((res) => {
            // שמור בקליינט
            res.json().then((newProduct) => {
                setProducts([...products, newProduct]);
                // הצג הודעת הצלחה
                setShortMessage({
                    open: true,
                    message: "New product added successful!",
                    severity: "success",
                });
                // חזור אחורה
                goBack();
            });
        });
    };

    // ערכת נושא לעיצוב לחצן בעת טעינה
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

    return (
        <div>
            <br />
            <h1>Add New Product</h1>
            <br />
            <Box
                component="form"
                sx={{
                    "& > :not(style)": { m: 1 /* , width: "25ch" */ },
                }}
                noValidate
                autoComplete="off"
            >
                <TextField
                    label="Title"
                    fullWidth
                    // sx={{ minWidth: "750px" }}
                    value={product.title}
                    onChange={(e) => {
                        setProduct({ ...product, title: e.target.value });
                    }}
                />
                <br />
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={categories}
                    sx={{ width: "200px" }}
                    renderInput={(params) => (
                        <TextField {...params} label="Category" />
                    )}
                    value={product.category}
                    freeSolo
                    onSelect={(e) => {
                        setProduct({ ...product, category: e.target.value });
                    }}
                />
                <TextField
                    label="Price"
                    sx={{ width: "200px" }}
                    type="Number"
                    value={product.price}
                    onChange={(e) => {
                        setProduct({ ...product, price: e.target.value });
                    }}
                />
                <br />
                <TextField
                    label="Description"
                    fullWidth
                    multiline
                    value={product.description}
                    onChange={(e) => {
                        setProduct({ ...product, description: e.target.value });
                    }}
                />
                <br />
                <Box alignItems="center">
                    <TextField
                        label="Image URL"
                        multiline
                        value={product.image}
                        style={{ width: "50%" }}
                        onChange={(e) => {
                            setProduct({ ...product, image: e.target.value });
                        }}
                    />
                    <img
                        src={product.image}
                        alt={product.image}
                        // key-צריך להשתמש ב src-כדי שהתמונה תשתנה מיד כשמשנים את ה
                        key={product.image}
                        className="product-image"
                    />
                </Box>
            </Box>
            <Box
                sx={{
                    "& > button": {
                        m: 1,
                        textTransform: "none",
                        width: "120px",
                    },
                }}
            >
                <Button onClick={goBack} variant="outlined" disabled={loading}>
                    <span>Cancel</span>
                </Button>

                <ThemeProvider theme={LoadingButtonTheme}>
                    <LoadingButton
                        onClick={saveHandle}
                        loading={loading}
                        variant="contained"
                        disabled={loading}
                    >
                        <span>Save</span>
                    </LoadingButton>
                </ThemeProvider>
            </Box>
        </div>
    );
}

export default AddProduct;
