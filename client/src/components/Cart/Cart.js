import "./Cart.css";
import MyContext from "../MyContext";
import { useContext } from "react";

export default function Cart() {
    const { cartProducts, addToCart, removeFromCart } = useContext(MyContext);
    return (
        <div className="cart">
            <img
                className="cart-icon"
                src="https://static.vecteezy.com/system/resources/previews/004/999/463/non_2x/shopping-cart-icon-illustration-free-vector.jpg"
                alt="My Cart"
            ></img>
            <ul>
                {cartProducts.map((product) => {
                    return (
                        <div key={product.id}>
                            <div>
                                <br></br>
                                <img
                                    className="cart-img"
                                    src={product.image}
                                    alt={product.title}
                                ></img>
                                <div>{product.title}</div>
                                {product.price} $
                            </div>
                            <button
                                onClick={() => {
                                    addToCart(product.id);
                                }}
                            >
                                +
                            </button>
                            {product.amount}
                            <button
                                onClick={() => {
                                    removeFromCart(product.id);
                                }}
                            >
                                -
                            </button>
                            <br></br>
                        </div>
                    );
                })}
            </ul>
        </div>
    );
}
