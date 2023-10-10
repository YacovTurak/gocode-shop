import { useParams } from "react-router-dom";
import Loader from "../../Loader/Loader";
import { useContext, useEffect, useState } from "react";
import MyContext from "../../MyContext";
import "./ProductDetails.css";

function ProductDetails() {
    const { id } = useParams();
    useEffect(() => {
        fetch(`/api/products/${id}`)
            .then((res) => res.json())
            .then((product) => {
                setProduct(product);
                setLoading(false);
            });
    }, [id]);
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState({});
    const { cartProducts, addToCart, removeFromCart } = useContext(MyContext);
    const amount = cartProducts.find((x) => x.id === product.id)?.amount ?? 0;

    if (loading) {
        return <Loader />;
    } else {
        return (
            <div>
                <br />
                <h1>{product.title}</h1>
                <img src={product.image} alt="" />
                <br />
                price: {product.price} $
                <button
                    onClick={() => {
                        addToCart(product.id);
                    }}
                >
                    +
                </button>
                {amount > 0 && amount}
                {amount > 0 && (
                    <button
                        onClick={() => {
                            removeFromCart(product.id);
                        }}
                    >
                        -
                    </button>
                )}
                <br />
                <p>{product.description}</p>
            </div>
        );
    }
}

export default ProductDetails;
