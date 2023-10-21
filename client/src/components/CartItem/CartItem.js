import * as React from "react";
import "./CartItem.css";
import { Button, Divider, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";
import MyContext from "../../MyContext";

export default function CartItem(props) {
    const { addToCart, removeFromCart, deleteFromCart } =
        React.useContext(MyContext);

    return (
        <>
            <div className="cart-card">
                <img
                    className="cart-image cart-card-child"
                    src={props.image}
                    alt=""
                />
                <div className="cart-title cart-card-child">
                    <h6 className="cart-title-child">
                        {props.title.length > 20
                            ? props.title.substring(0, 20) + "..."
                            : props.title}
                    </h6>
                    <div className="cart-price cart-title-child">
                        <h6 className="cart-price-child cart-price-child-left">
                            {props.price} $
                        </h6>
                        <div className="cart-price-child-right">
                            <Button
                                className="cart-price-child"
                                sx={{
                                    minWidth: "unset",
                                    width: "20px",
                                    height: "20px",
                                    padding: "5px",
                                }}
                                variant="outlined"
                                onClick={() => addToCart(props.id)}
                            >
                                <AddIcon
                                    sx={{ width: "15px", height: "15px" }}
                                />
                            </Button>
                            <h6 className="cart-price-child">{props.amount}</h6>
                            <Button
                                className="cart-price-child"
                                sx={{
                                    minWidth: "unset",
                                    width: "20px",
                                    height: "20px",
                                    padding: "5px",
                                }}
                                variant="outlined"
                                onClick={() => removeFromCart(props.id)}
                            >
                                <RemoveIcon
                                    sx={{ width: "15px", height: "15px" }}
                                />
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="cart-total cart-card-child">
                    <IconButton
                        onClick={() => deleteFromCart(props.id)}
                        sx={{
                            marginLeft: "auto",
                            alignSelf: "flex-start",
                            padding: "3px",
                        }}
                    >
                        <CloseIcon sx={{ width: "15px", height: "15px" }} />
                    </IconButton>
                    <h6 className="cart-total-total">
                        {props.price * props.amount} $
                    </h6>
                </div>
            </div>
            <Divider sx={{ margin: "5px" }} />
        </>
    );
}
