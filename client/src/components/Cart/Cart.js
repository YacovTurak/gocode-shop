import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import MyContext from "../MyContext";
import { Badge, Button, DialogContent, Typography } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CartItem from "../CartItem/CartItem.js";
import "./Cart.css";
// import emptyCart from "....../public/images/empty-cart.png";
// import emptyCart from "..../public/images/empty-cart.png";
// import imagePath from "./public/images/empty-cart.png";
// const imagePath = "./public/images/empty-cart.png";

export default function Cart() {
    const { cartProducts, showCart, setShowCart } = React.useContext(MyContext);

    const drawerWidth = 340;

    const DrawerHeader = styled("div")(({ theme }) => ({
        display: "flex",
        alignItems: "center",
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: "flex-start",
    }));

    const handleDrawerClose = () => {
        setShowCart(false);
    };

    const EmptyCart = () => {
        return (
            <div
                style={{
                    marginTop: "auto",
                    marginBottom: "auto",
                    alignSelf: "center",
                    textAlign: "center",
                }}
            >
                <img
                    src="/images/empty-cart.png"
                    alt=""
                    style={{ width: "75%" }}
                />
                <br />
                <br />
                <br />
                <h1>Your cart is empty</h1>
            </div>
        );
    };

    return (
        <Box sx={{ display: "flex" }}>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        boxShadow:
                            "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
                        backgroundColor: "#f0f0f0",
                    },
                }}
                variant="persistent"
                anchor="right"
                open={showCart}
            >
                <DrawerHeader>
                    <Button
                        onClick={handleDrawerClose}
                        endIcon={
                            <Badge
                                badgeContent={cartProducts.length}
                                color="secondary"
                            >
                                <ShoppingCartIcon style={{ fontSize: 40 }} />
                            </Badge>
                        }
                        sx={{ margin: "auto" }}
                    >
                        My Cart
                    </Button>
                </DrawerHeader>
                <Divider />
                {cartProducts.length > 0 ? (
                    <>
                        <DialogContent sx={{ padding: "unset" }}>
                            <List>
                                {cartProducts.map((product) => (
                                    <CartItem
                                        key={product.id}
                                        id={product.id}
                                        title={product.title}
                                        price={product.price}
                                        amount={product.amount}
                                        image={product.image}
                                    />
                                ))}
                            </List>
                        </DialogContent>
                        <div
                            className="sub-total"
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                padding: "15px",
                                marginLeft: "0",
                                marginRight: "0",
                                borderTop: "1px solid rgb(0, 0, 0, 0.5)",
                                fontWeight: "bold",
                            }}
                        >
                            <div>Subtotal:</div>
                            <div>
                                {cartProducts
                                    .reduce(function (acc, product) {
                                        return (
                                            acc + product.price * product.amount
                                        );
                                    }, 0)
                                    .toFixed(2) + "$"}
                            </div>
                        </div>
                    </>
                ) : (
                    <EmptyCart />
                )}
            </Drawer>
        </Box>
    );
}
