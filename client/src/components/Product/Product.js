import "./Product.css";
import MyContext from "../MyContext";
import { useContext } from "react";
import { Link } from "react-router-dom";
import {
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardMedia,
    Grid,
    Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

export default function Product(props) {
    const { cartProducts, addToCart, removeFromCart } = useContext(MyContext);
    const amount = cartProducts.find((x) => x.id === props.id)?.amount ?? 0;

    // המוצר כבר בעגלה
    const HasInCart = () => {
        return (
            <Grid
                container
                justifyContent="center"
                spacing={1.5}
                alignItems="center"
            >
                <Grid item>
                    <Button
                        sx={{ width: "20px", minWidth: "unset" }}
                        variant="outlined"
                        onClick={() => addToCart(props.id)}
                    >
                        <AddIcon fontSize="small" />
                    </Button>
                </Grid>
                <Grid item>
                    <Typography component={"h1"}>{amount}</Typography>
                </Grid>
                <Grid item>
                    <Button
                        sx={{ width: "20px", minWidth: "unset" }}
                        variant="outlined"
                        onClick={() => removeFromCart(props.id)}
                    >
                        <RemoveIcon fontSize="small" />
                    </Button>
                </Grid>
            </Grid>
        );
    };
    // המוצר לא בעגלה
    const NotInCart = () => {
        return (
            <Button
                variant="contained"
                sx={{
                    borderRadius: "20px",
                    margin: "auto",
                    textTransform: "none",
                    minWidth: "150px",
                }}
                onClick={() => {
                    addToCart(props.id);
                }}
            >
                Add to cart
            </Button>
        );
    };

    return (
        <Card sx={{ width: 300 }} className="product-card">
            <Link
                to={`/products/${props.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
            >
                <CardActionArea sx={{ padding: "15px", paddingBottom: 0 }}>
                    <CardMedia
                        component="img"
                        height="250"
                        image={props.image}
                        alt=""
                    />
                    <CardContent sx={{ paddingBottom: 0 }}>
                        <Typography
                            gutterBottom
                            variant="h5"
                            component="div"
                            style={{ height: "2.9em" }}
                        >
                            {props.title.length > 30
                                ? props.title.substring(0, 30) + "..."
                                : props.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {props.price} $
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Link>
            <CardActions disableSpacing>
                {amount === 0 ? <NotInCart /> : <HasInCart />}
            </CardActions>
        </Card>
    );
}
