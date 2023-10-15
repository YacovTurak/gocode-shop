import { useContext } from "react";
import Header from "../Header/Header";
import Products from "../Products/Products";
import "./style.css";
import MyContext from "../MyContext";

function Home() {
    const { productsFiltered, categories } = useContext(MyContext);

    return (
        <div>
            <Header categories={categories} />
            <Products products={productsFiltered} />
        </div>
    );
}

export default Home;
