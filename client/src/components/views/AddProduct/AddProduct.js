import { Alert, Box, Button, MenuItem, TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useContext, useEffect, useRef, useState } from "react";
import MyContext from "../../MyContext";
import "./AddProduct.css";
import { useLocation, useNavigate } from "react-router-dom";

function AddProduct() {
    const [product, setProduct] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const { categories, products, setProducts } = useContext(MyContext);
    const successMessage = useRef(null);
    const location = useLocation();

    useEffect(() => {
        successMessage.current?.scrollIntoView({ behavior: "smooth" });
    }, [success]);

    const navigate = useNavigate();
    const goBack = () => {
        if (location.key !== "default") {
            navigate(-1);
        } else {
            navigate("/");
        }
    };

    const saveHandle = () => {
        setLoading(true);
        fetch("/api/products", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(product),
        }).then((res) => {
            res.json().then((newProduct) => {
                setProducts([...products, newProduct]);
                setLoading(false);
                setSuccess(true);
                successMessage.current?.scrollIntoView({ behavior: "smooth" });
                setTimeout(goBack, 3500);
            });
        });
    };

    return (
        <div>
            <br />
            <h1>New Product</h1>
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
                <TextField
                    select
                    label="Category"
                    sx={{ width: "200px" }}
                    value={product.category}
                    onChange={(e) => {
                        setProduct({ ...product, category: e.target.value });
                        console.log(e.target.value);
                    }}
                >
                    {categories.map((category) => (
                        <MenuItem key={category} value={category}>
                            {category}
                        </MenuItem>
                    ))}
                </TextField>

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
                <Button onClick={goBack} loading={loading} variant="outlined">
                    <span>Cancel</span>
                </Button>

                <LoadingButton
                    onClick={saveHandle}
                    loading={loading}
                    variant="contained"
                    disabled={success}
                >
                    <span>Save</span>
                </LoadingButton>
            </Box>
            {success && (
                <Alert ref={successMessage} severity="success">
                    New product is added successful!
                </Alert>
            )}
        </div>
    );
}

export default AddProduct;
