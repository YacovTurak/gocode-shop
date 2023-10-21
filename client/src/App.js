import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/views/Home";
import ProductDetails from "./components/views/ProductDetails/ProductDetails";
import MyContext from "./components/MyContext";
import { forwardRef, useEffect, useState } from "react";
import Loader from "./components/Loader/Loader";
import Cart from "./components/Cart/Cart";
import Admin from "./components/views/Admin";
import AddProduct from "./components/views/AddProduct/AddProduct";
import MuiAlert from "@mui/material/Alert";
import { Snackbar } from "@mui/material";
import Navbar from "./components/views/Navbar/Navbar.js";

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// let allProducts = [];
let categories = [];

function App() {
    const [cartProducts, setCartProducts] = useState([]);
    const [products, setProducts] = useState([]);
    const [productsFiltered, setProductsFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState("All Products");
    const [sliderValue, setSliderValue] = useState([0, 1000]);
    const [showCart, setShowCart] = useState(false);

    // used for success message
    const [ShortMessage, setShortMessage] = useState({ open: false });

    useEffect(() => {
        fetch("/api/products")
            .then((res) => res.json())
            .then((products) => {
                setProducts(products);
                // setProductsFiltered([...products]);
                setLoading(false);
            });
    }, []);

    // כשרשימת המוצרים מתעדכנת - עדכן את רשימת המוצרים המסוננים
    useEffect(() => {
        filterProducts(category, sliderValue);
        categories = products
            .map((p) => p.category)
            .filter((value, index, array) => array.indexOf(value) === index);
    }, [products]);

    // סינון המוצרים
    const filterProducts = (category, sliderValue) => {
        let newProducts;
        if (category === "All Products") {
            newProducts = products.filter(
                (product) =>
                    (product?.price ?? 0) >= sliderValue[0] &&
                    (product?.price ?? 0) <= sliderValue[1]
            );
        } else {
            newProducts = products.filter(
                (product) =>
                    product.category === category &&
                    (product?.price ?? 0) >= sliderValue[0] &&
                    (product?.price ?? 0) <= sliderValue[1]
            );
        }
        setProductsFiltered(newProducts);
        setCategory(category);
    };

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

    const deleteFromCart = (id) => {
        setCartProducts(cartProducts.filter((product) => product.id !== id));
    };

    const context = {
        showCart: showCart,
        setShowCart: setShowCart,
        cartProducts: cartProducts,
        addToCart: addToCart,
        removeFromCart: removeFromCart,
        deleteFromCart: deleteFromCart,
        products: products,
        setProducts: setProducts,
        filterProducts: filterProducts,
        productsFiltered: productsFiltered,
        setProductsFiltered: setProductsFiltered,
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
                    <Navbar />
                    <Cart />
                    <div style={{ height: 80 }} />
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
