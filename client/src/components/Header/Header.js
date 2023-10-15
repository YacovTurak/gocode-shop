import { useContext, useRef } from "react";
import "./Header.css";
import { Box, Slider } from "@mui/material";
import MyContext from "../MyContext";

function Header({ categories }) {
    const selectInput = useRef("All Products");
    const {
        category,
        setCategory,
        sliderValue,
        setSliderValue,
        filterProducts,
    } = useContext(MyContext);

    function sliderValuetext() {
        return `${sliderValue} $`;
    }

    return (
        <nav className="product-filter">
            <br />
            <Box sx={{ width: 320 }}>
                <h3>Filter by price</h3>
                <Slider
                    value={sliderValue}
                    onChange={(event, newValue) => {
                        setSliderValue(newValue);
                        filterProducts(selectInput.current.value, newValue);
                    }}
                    valueLabelDisplay="auto"
                    getAriaValueText={sliderValuetext}
                    min={0}
                    max={1000}
                    disableSwap
                />
            </Box>
            <h1>Jackets</h1>

            <div className="sort">
                <div className="collection-sort">
                    <label>Filter by:</label>
                    <select
                        value={category}
                        ref={selectInput}
                        onChange={(e) => {
                            setCategory(e.target.value);
                            filterProducts(e.target.value, sliderValue);
                        }}
                    >
                        <option value="All Products">All Products</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="collection-sort">
                    <label>Sort by:</label>
                    <select>
                        <option value="/">Featured</option>
                        <option value="/">Best Selling</option>
                        <option value="/">Alphabetically, A-Z</option>
                        <option value="/">Alphabetically, Z-A</option>
                        <option value="/">Price, low to high</option>
                        <option value="/">Price, high to low</option>
                        <option value="/">Date, new to old</option>
                        <option value="/">Date, old to new</option>
                    </select>
                </div>
            </div>
        </nav>
    );
}

export default Header;
