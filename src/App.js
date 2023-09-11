import { useEffect, useState } from "react";
import Header from "./components/Header/Header";
import Products from "./components/Products/Products";
import Text from "./components/Text";
import Loader from "./components/Loader/Loader";
import "./style.css";

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

    const filterProducts = (category) => {
        if (category == "all") {
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
            <div>
                <Header onFilter={filterProducts} categories={categories} />
                <Products products={products} />
            </div>
        );
    }
    return <>{components}</>;
}

export default App;
