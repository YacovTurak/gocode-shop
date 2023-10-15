import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Slide from "@mui/material/Slide";
import {
    BottomNavigation,
    BottomNavigationAction,
    ToggleButton,
    ToggleButtonGroup,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const SimpleBottomNavigation = () => {
    const [value, setValue] = React.useState(0);
    const navigate = useNavigate();

    return (
        <Box sx={{ width: 300 }}>
            <BottomNavigation
                showLabels
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                    let navTarget;
                    switch (newValue) {
                        case 0:
                            navTarget = "/";
                            break;
                        case 1:
                            navTarget = "/admin";
                            break;
                    }
                    navigate(navTarget);
                }}
            >
                <BottomNavigationAction
                    label="Home" /* icon={<RestoreIcon />} */
                />
                <BottomNavigationAction
                    label="Admin" /* icon={<FavoriteIcon />} */
                />
            </BottomNavigation>
        </Box>
    );
};

function HideOnScroll(props) {
    const { children } = props;
    const trigger = useScrollTrigger();

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
}

// HideOnScroll.propTypes = {
//     children: PropTypes.element.isRequired,
// };

export default function NavBar(props) {
    const [alignment, setAlignment] = React.useState("web");

    const handleChange = (event, newAlignment) => {
        setAlignment(newAlignment);
    };

    return (
        <React.Fragment>
            <HideOnScroll {...props}>
                <AppBar>
                    <Toolbar>
                        {/* <ToggleButtonGroup
                            value={alignment}
                            exclusive
                            onChange={handleChange}
                            aria-label="Platform"
                        >
                            <ToggleButton value="web">Web</ToggleButton>
                            <ToggleButton value="android">Android</ToggleButton>
                            <ToggleButton value="ios">iOS</ToggleButton>
                        </ToggleButtonGroup> */}
                        <SimpleBottomNavigation />
                    </Toolbar>
                </AppBar>
            </HideOnScroll>
            <Toolbar />
        </React.Fragment>
    );
}
