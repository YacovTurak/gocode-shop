import "./Product.css";
import MyContext from "../MyContext";
import { useContext } from "react";
import { Link } from "react-router-dom";

function Product(props) {
    const { cartProducts, addToCart, removeFromCart } = useContext(MyContext);
    const amount = cartProducts.find((x) => x.id === props.id)?.amount ?? 0;

    return (
        <div className="product-card">
            <div className="product-image">
                <Link to={`/products/${props.id}`}>
                    <img src={props.image} alt="" />
                </Link>
            </div>
            <div className="product-info">
                <h5>{props.title}</h5>
                <h6>${props.price}</h6>
                <button
                    onClick={() => {
                        addToCart(props.id);
                    }}
                >
                    +
                </button>
                {amount > 0 && amount}
                {amount > 0 && (
                    <button
                        onClick={() => {
                            removeFromCart(props.id);
                        }}
                    >
                        -
                    </button>
                )}
            </div>
        </div>
    );
}

export default Product;
