import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./components/views/Home";
import ProductDetails from "./components/views/ProductDetails/ProductDetails";
import MyContext from "./components/MyContext";
import { forwardRef, useEffect, useState } from "react";
import Loader from "./components/Loader/Loader";
import Cart from "./components/Cart/Cart";
import Admin from "./components/views/Admin";
import AddProduct from "./components/views/AddProduct/AddProduct";
import MuiAlert from "@mui/material/Alert";
import { Button, Snackbar } from "@mui/material";

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

let allProduct = [];
let categories = [];

function App() {
    const [cartProducts, setCartProducts] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState("All Products");
    const [sliderValue, setSliderValue] = useState([0, 1000]);

    // used for success message
    const [ShortMessage, setShortMessage] = useState({ open: false });

    useEffect(() => {
        fetch("/api/products")
            .then((res) => res.json())
            .then((products) => {
                setProducts(products);
                allProduct = [...products];
                setLoading(false);
                categories = products
                    .map((p) => p.category)
                    .filter(
                        (value, index, array) => array.indexOf(value) === index
                    );
            });
    }, []);

    // used for success message
    const handleShortMessageClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setShortMessage({ ...ShortMessage, open: false });
    };

    const addToCart = (id) => {
        const amount = (cartProducts.find((x) => x.id === id)?.amount ?? 0) + 1;
        const product = products.find((x) => x.id === id);

        let newCartProducts;
        if (amount > 1) {
            newCartProducts = cartProducts.map((product) => {
                if (product.id === id) {
                    return { ...product, amount: amount };
                } else {
                    return product;
                }
            });
        } else {
            newCartProducts = [...cartProducts, { ...product, amount: 1 }];
        }
        setCartProducts(newCartProducts);
    };

    const removeFromCart = (id) => {
        const amount = cartProducts.find((x) => x.id === id).amount - 1;

        let newCartProducts;
        if (amount === 0) {
            newCartProducts = cartProducts.filter(
                (product) => product.id !== id
            );
        } else {
            newCartProducts = cartProducts.map((product) => {
                if (product.id === id) {
                    return { ...product, amount: amount };
                } else {
                    return product;
                }
            });
        }
        setCartProducts(newCartProducts);
    };

    const context = {
        cartProducts: cartProducts,
        addToCart: addToCart,
        removeFromCart: removeFromCart,
        products: products,
        setProducts: setProducts,
        allProduct: allProduct,
        categories: categories,
        category: category,
        setCategory: setCategory,
        sliderValue: sliderValue,
        setSliderValue: setSliderValue,
        setShortMessage: setShortMessage,
    };

    if (loading) {
        return <Loader />;
    } else {
        return (
            <MyContext.Provider value={context}>
                <Router>
                    <Cart />
                    <Link to="/">
                        <h1>Home</h1>
                    </Link>
                    <Link to="/admin">
                        <h1>Admin</h1>
                    </Link>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route
                            path="/products/:id"
                            element={<ProductDetails />}
                        />
                        <Route path="/admin" element={<Admin />} />
                        <Route path="/products/add" element={<AddProduct />} />
                    </Routes>
                </Router>
                <Snackbar
                    open={ShortMessage.open}
                    autoHideDuration={6000}
                    onClose={handleShortMessageClose}
                >
                    <Alert
                        onClose={handleShortMessageClose}
                        severity={ShortMessage?.severity}
                        sx={{ width: "100%" }}
                    >
                        {ShortMessage?.message}
                    </Alert>
                </Snackbar>
            </MyContext.Provider>
        );
    }
}

export default App;
