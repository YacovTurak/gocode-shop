const express = require("express");
const fs = require("fs");
const mongoose = require("mongoose");
// ########################################################################################
const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));
const { AES, enc } = require("crypto-js");
// html מנתח
const cheerio = require("cheerio");
// ########################################################################################

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

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
});
const User = mongoose.model("User", userSchema);

app.get("/api/products", (req, res) => {
    const { title, category, min_price, max_price } = req.query;
    // fs.readFile("products.json", "utf8", (err, data) => {
    //     let products = JSON.parse(data);
    //     res.send(products);
    // });
    // return;
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
        res.send({
            id: newProduct._id,
            title: newProduct.title,
            category: newProduct.category,
            price: newProduct.price,
            description: newProduct.description,
            image: newProduct.image,
            rating: newProduct.rating,
        });
    });
});

app.put("/api/products/:id", (req, res) => {
    const { id } = req.params;
    const product = req.body;
    Product.findByIdAndUpdate(id, product, { new: true }).then(
        (updatedProduct) => {
            res.send({
                id: updatedProduct._id,
                title: updatedProduct.title,
                category: updatedProduct.category,
                price: updatedProduct.price,
                description: updatedProduct.description,
                image: updatedProduct.image,
                rating: updatedProduct.rating,
            });
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

app.post("/api/users", (req, res) => {
    const { name, email, password } = req.body;
    User.findOne({ email }).then((data) => {
        if (!data) {
            const user = new User({ name, email, password });
            user.save()
                .then((arg1, arg2) => {
                    res.json({ success: "user has successfully registered" });
                })
                .catch((err) => res.json({ err }));
        } else {
            res.json({ error: "user is alredy exist" });
        }
    });
});

// ##################################################################################################################
const secret = "12345678123456781234567812345678";

app.post("/api/convert", (req, res) => {
    const { url } = req.body;
    const bytes = AES.decrypt(url, secret);
    const urlDecoded = bytes.toString(enc.Utf8);

    fetch(urlDecoded).then((result) => {
        result.arrayBuffer().then((buffer) => {
            const base64 =
                "data:image/jpeg;base64," + arrayBufferToBase64(buffer);
            const text = base64;
            const cipherText = AES.encrypt(text, secret);
            const decodedText = cipherText.toString();
            res.send(decodedText);
        });
    });
});

function arrayBufferToBase64(buffer) {
    var binary = "";
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return Buffer.from(binary, "binary").toString("base64");
}

app.post("/api/url", (req, res) => {
    const { url } = req.body;
    const bytes = AES.decrypt(url, secret);
    const urlDecoded = bytes.toString(enc.Utf8);

    fetch(urlDecoded).then((result) => {
        result.text().then((data) => {
            replaceSrcs(data).then((htmlStr) => {
                const text = htmlStr;
                const cipherText = AES.encrypt(text, secret);
                const decodedText = cipherText.toString();
                res.send(decodedText);
            });
        });
    });
});

async function replaceSrcs(html) {
    // שלח בקשת fetch לכתובת ה-URL
    // const response = await fetch(url);

    // if (response.ok) {
    // אם הבקשה הצליחה, קרא את התוכן כטקסט
    //   const html = await response.text();
    const $ = cheerio.load(html);

    // עבור כל תמונה בדף
    $("img").each(async (index, element) => {
        const imgSrc = $(element).attr("src");

        if (imgSrc) {
            if (imgSrc.startsWith("http")) {
                fetch(imgSrc).then((result) => {
                    result.arrayBuffer().then((buffer) => {
                        const base64 =
                            "data:image/jpeg;base64," +
                            arrayBufferToBase64(buffer);
                        const imgMime = result.headers.get("content-type");
                        console.log("TCL: replaceSrcs -> imgMime", imgMime);

                        // // שלח בקשת fetch לכתובת של התמונה
                        // const imgResponse = await fetch(imgSrc);

                        // if (imgResponse.ok) {
                        //     const imgBuffer = await imgResponse.arrayBuffer(); // קרא את תוכן התמונה כ-buffer
                        //     const imgBase64 = imgBuffer.toString("base64");
                        //     const imgMime = imgResponse.headers.get("content-type");

                        // בנה Data URI מהתוכן וה-MIME type
                        // const dataUri = `data:${imgMime};base64,${imgBase64}`;
                        const dataUri = `data:${imgMime};base64,${Base64}`;

                        // שנה את ה-attribut src של התמונה ל-Data URI
                        $(element).attr("src", dataUri);
                    });
                });
            }
        }
    });

    // כתוב את ה-HTML המעודכן לקובץ או הצג אותו
    //   console.log($.html());
    const returnHtml = await $.html();
    return returnHtml;
    // } else {
    //   console.error('Failed to fetch the URL');
    // }
}
// ##################################################################################################################

app.get("*", (req, res) => {
    res.sendFile(__dirname + "/client/build/index.html");
});

const initProducts = () => {
    Product.findOne({}).then((err, product) => {
        if (err) {
            console.log("err", err);
        }
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
    console.log(`listening on port ${process.env.PORT || 5000}`);
    // initProducts();
});
