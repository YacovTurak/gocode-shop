import { useEffect, useState } from "react";
import Header from "./components/Header/Header";
import Products from "./components/Products/Products";
import Loader from "./components/Loader/Loader";
import "./style.css";
import Cart from "./components/Cart/Cart";
import MyContext from "./components/MyContext";

let categories = [];
let allProduct = [];

function App() {
    useEffect(() => {
        fetch("https://fakestoreapi.com/products")
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

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cartProducts, setCartProducts] = useState([]);

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

    const filterProducts = (category) => {
        if (category === "All Products") {
            setProducts([...allProduct]);
        } else {
            setProducts(
                allProduct.filter((product) => product.category === category)
            );
        }
    };

    let components;
    if (loading) {
        components = <Loader />;
    } else {
        components = (
            <MyContext.Provider
                value={[cartProducts, addToCart, removeFromCart]}
            >
                <div>
                    <Cart />
                    <Header onFilter={filterProducts} categories={categories} />
                    <Products products={products} />
                </div>
            </MyContext.Provider>
        );
    }
    return <>{components}</>;
}

export default App;
