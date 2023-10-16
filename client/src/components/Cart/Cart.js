// import "./Cart.css";
// import MyContext from "../MyContext";
// import { useContext } from "react";

// export default function Cart() {
//     const { cartProducts, addToCart, removeFromCart } = useContext(MyContext);
//     return (
//         <div className="cart">
//             <img
//                 className="cart-icon"
//                 src="https://static.vecteezy.com/system/resources/previews/004/999/463/non_2x/shopping-cart-icon-illustration-free-vector.jpg"
//                 alt="My Cart"
//             ></img>
//             <ul>
//                 {cartProducts.map((product) => {
//                     return (
//                         <div key={product.id}>
//                             <div>
//                                 <br></br>
//                                 <img
//                                     className="cart-img"
//                                     src={product.image}
//                                     alt={product.title}
//                                 ></img>
//                                 <div>{product.title}</div>
//                                 {product.price} $
//                             </div>
//                             <button
//                                 onClick={() => {
//                                     addToCart(product.id);
//                                 }}
//                             >
//                                 +
//                             </button>
//                             {product.amount}
//                             <button
//                                 onClick={() => {
//                                     removeFromCart(product.id);
//                                 }}
//                             >
//                                 -
//                             </button>
//                             <br></br>
//                         </div>
//                     );
//                 })}
//             </ul>
//         </div>
//     );
// }

import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import MyContext from "../MyContext";
import { Button } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const drawerWidth = 240;

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-start",
}));

export default function Cart() {
    const { showCart, setShowCart } = React.useContext(MyContext);

    const handleDrawerClose = () => {
        setShowCart(false);
    };

    return (
        <Box sx={{ display: "flex" }}>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                    },
                }}
                variant="persistent"
                anchor="right"
                open={showCart}
            >
                <DrawerHeader>
                    <Button
                        onClick={handleDrawerClose}
                        endIcon={<ShoppingCartIcon />}
                        sx={{ margin: "auto" }}
                    >
                        My Cart
                    </Button>
                </DrawerHeader>
                <Divider />
                <List>
                    {["Inbox", "Starred", "Send email", "Drafts"].map(
                        (text, index) => (
                            <ListItem key={text} disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                        {index % 2 === 0 ? (
                                            <InboxIcon />
                                        ) : (
                                            <MailIcon />
                                        )}
                                    </ListItemIcon>
                                    <ListItemText primary={text} />
                                </ListItemButton>
                            </ListItem>
                        )
                    )}
                </List>
            </Drawer>
        </Box>
    );
}
