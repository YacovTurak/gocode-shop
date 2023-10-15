import * as React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";

const NavigationMenu = () => {
    return (
        <AppBar position="fixed">
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                    <Typography variant="h6">Home</Typography>
                    <Typography variant="h6">Admin</Typography>
                    <Typography variant="h6">Cart</Typography>
                </div>
            </Toolbar>
        </AppBar>
    );
};

export default NavigationMenu;
