const express = require("express");
const fs = require("fs");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.static("client/build"));

const productSchema = new mongoose.Schema({
    title: String,
    price: Number,
    description: String,
    category: String,
    image: String,
});

const Product = mongoose.model("Product", productSchema);

app.get("/api/products", (req, res) => {
    const { title, category, min_price, max_price } = req.query;
    Product.find({
        /* title: { $regex: title, $options: "i" } */
    }).then((products) => {
        if (title) {
            products = products.filter((product) =>
                product.title.toLowerCase().includes(title.toLowerCase())
            );
        }
        if (category) {
            products = products.filter((product) =>
                product.category.toLowerCase().includes(category.toLowerCase())
            );
        }
        if (min_price) {
            products = products.filter((product) => product.price >= min_price);
        }
        if (max_price) {
            products = products.filter((product) => product.price <= max_price);
        }
        const productsToSend = products.map((product) => {
            return {
                id: product._id,
                title: product.title,
                category: product.category,
                price: product.price,
                description: product.description,
                image: product.image,
                rating: product.rating,
            };
        });
        res.send(productsToSend);
    });
});

app.get("/api/products/:id", (req, res) => {
    const { id } = req.params;
    Product.findById(id).then((product) => {
        res.send({
            id: product._id,
            title: product.title,
            category: product.category,
            price: product.price,
            description: product.description,
            image: product.image,
            rating: product.rating,
        });
    });
});

app.post("/api/products", (req, res) => {
    const { title, price, description, category, image, rating } = req.body;
    const product = new Product({ title, price, description, category, image });
    product.save().then((newProduct) => {
        res.send(newProduct);
    });
});

app.put("/api/products/:id", (req, res) => {
    const { id } = req.params;
    const product = req.body;
    Product.findByIdAndUpdate(id, product, { new: true }).then(
        (updatedProduct) => {
            res.send(updatedProduct);
        }
    );
});

app.delete("/api/products/:id", (req, res) => {
    const { id } = req.params;
    Product.findByIdAndDelete(id).then(
        Product.find({}).then((products) => {
            res.send(products);
        })
    );
});

app.get("*", (req, res) => {
    res.sendFile(__dirname + "/client/build/index.html");
});

const initProducts = () => {
    Product.findOne({}).then((product) => {
        if (!product) {
            fs.readFile("./products.json", "utf8", (err, data) => {
                const products = JSON.parse(data);
                Product.insertMany(products);
            });
        }
    });
};

const { DB_USER, DB_PASS, DB_HOST, DB_NAME } = process.env;
mongoose.connect(
    `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}`,
    // "mongodb://127.0.0.1:27017/gocode_shop",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
);

app.listen(process.env.PORT || 5000, () => {
    console.log("Ani Maazin!");
    initProducts();
});
