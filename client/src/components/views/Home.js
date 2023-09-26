import { useContext } from "react";
import Header from "../Header/Header";
import Products from "../Products/Products";
import "./style.css";
import MyContext from "../MyContext";

function Home() {
    const { products, setProducts, allProduct, categories, setCategory } =
        useContext(MyContext);

    const filterProducts = (category, sliderValue) => {
        let newProducts;
        if (category === "All Products") {
            newProducts = allProduct.filter(
                (product) =>
                    product.price >= sliderValue[0] &&
                    product.price <= sliderValue[1]
            );
        } else {
            newProducts = allProduct.filter(
                (product) =>
                    product.category === category &&
                    product.price >= sliderValue[0] &&
                    product.price <= sliderValue[1]
            );
        }
        setProducts(newProducts);
        setCategory(category);
    };

    return (
        <div>
            <Header onFilter={filterProducts} categories={categories} />
            <Products products={products} />
        </div>
    );
}

export default Home;
