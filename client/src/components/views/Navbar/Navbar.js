import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Slide from "@mui/material/Slide";
import { Button, List, ListItemIcon } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link } from "react-router-dom";
import MyContext from "../../MyContext";
import "./Navbar.css";

function HideOnScroll(props) {
    const { children } = props;
    const trigger = useScrollTrigger();

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
}

export default function Navbar(props) {
    const { showCart, setShowCart, cartProducts } = React.useContext(MyContext);

    return (
        // <HideOnScroll {...props}>
        <AppBar
            component="nav"
            position="fixed"
            sx={{ backgroundColor: "ButtonFace" }}
        >
            <Toolbar>
                <List sx={{ flexGrow: 1 }}>
                    <Link to="/">
                        <ListItemIcon>Home</ListItemIcon>
                    </Link>
                    <Link to="/admin">
                        <ListItemIcon>Admin</ListItemIcon>
                    </Link>
                </List>
                <Button
                    onClick={() => {
                        setShowCart(true);
                    }}
                    sx={{ ...(showCart && { display: "none" }) }}
                    endIcon={<ShoppingCartIcon />}
                >
                    My Cart
                </Button>
                {cartProducts.length === 0 ? (
                    ""
                ) : (
                    <div className="circle-text">
                        <div>{cartProducts.length}</div>
                    </div>
                )}
            </Toolbar>
        </AppBar>
        // </HideOnScroll>
    );
}
