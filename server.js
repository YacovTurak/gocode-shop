const express = require("express");
const fs = require("fs");
const mongoose = require("mongoose");
// ########################################################################################
const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));
// const { Readable, PassThrough } = require("stream");
// const { promisify } = require("util");
// const streamToBuffer = promisify(require("stream").pipeline);
// const SplitStream = require("./splitStream");
// const stream = require("stream");

// const crypto = require("crypto");
// const { encrypt } = require("./crypto");

const { AES, enc } = require("crypto-js");
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
// app.post("/api/convert", async (req, res) => {
//     const { url } = req.body;

//     const result = await fetch(url);
//     const contentType = result.headers.get("Content-Type");

//     if (contentType && contentType.startsWith("image/")) {
//         const base64 = await convertToBase64(result.body);
//         const [part1, part2] = splitText(base64);

//         console.log("TCL: part1", part1);
//         console.log("TCL: part2", part2);

//         res.json({ part1, part2 });
//     } else {
//         res.status(400).json({ error: "Invalid content type" });
//     }
// });

// async function convertToBase64(readableStream) {
//     let base64 = "data:image/jpeg;base64,";
//     const buffer = await streamToBuffer(readableStream, new PassThrough());
//     base64 += buffer.toString("base64");
//     return base64;
// }

// function splitText(text) {
//     const textLength = text.length;
//     const firstHalf = text.slice(0, textLength - 3);
//     const secondHalf = text.slice(textLength - 3);
//     return [firstHalf, secondHalf];
// }

// const secretKey = "המפתח_הסודי_שלך";
// const iv = crypto.randomBytes(16);
// console.log("TCL: iv", iv);

// function encrypt(data) {
//     const cipher = crypto.createCipheriv("aes-256-cbc", secretKey, null);
//     let encrypted = cipher.update(data, "utf-8", "hex");
//     encrypted += cipher.final("hex");
//     return encrypted;
// }

// function decrypt(data) {
//     const decipher = crypto.createCipheriv("aes-256-cbc", secretKey, iv);
//     let decrypted = decipher.update(data, "hex", "utf-8");
//     decrypted += decipher.final("utf-8");
//     return decrypted;
// }

app.post("/api/convert", (req, res) => {
    const { url } = req.body;
    fetch(url).then((result) => {
        result.arrayBuffer().then((buffer) => {
            const base64 =
                "data:image/jpeg;base64," + arrayBufferToBase64(buffer);
            const secret = "12345678123456781234567812345678";
            // const text = "hello";
            const text = base64;
            const cipherText = AES.encrypt(text, secret);
            const decodedText = cipherText.toString();
            console.log("TCL: decodedText", decodedText);
            res.send(decodedText);

            // const encryptData = encrypt(base64);
            // res.send(encryptData);
            // const [part1, part2, textLength] = splitText(base64);

            // const contentType = result.headers.get("Content-Type");
            // const textToSplit = part1 + "~" + part2 + "~" + textLength; // שים את הטקסט כאן
            // const textStream = new stream.PassThrough();
            // const longTextStream = new stream.PassThrough();
            // const splitStream = new SplitStream();

            // textStream.pipe(splitStream);
            // longTextStream.pipe(splitStream);

            // // שלח את הטקסט לצד הלקוח
            // result.body.pipe(textStream);
            // result.body.pipe(longTextStream);

            // res.setHeader("Content-Type", "application/json");
            // res.json({ text: textStream, longText: longTextStream });
        });
    });
});

// app.post("/large-text", (req, res) => {
//     const { url } = req.body;
//     fetch(url).then((result) => {
//         result.arrayBuffer().then((buffer) => {
//             const base64 =
//                 `~${result.headers.get("Content-Type")}~` +
//                 arrayBufferToBase64(buffer);
//             const [part1, part2, textLength] = splitText(base64);
//             // יצירת Stream קריאת טקסט ארוך מאוד
//             const largeTextStream = createLargeTextStream(
//                 part1 + "~" + part2 + "~" + textLength
//             );
//             console.log(part1 + part2);

//             // הגדרת כותרת וסוג התוכן
//             res.setHeader("Content-Type", "application/octet-stream");

//             // השמת הזרם בתגובה
//             largeTextStream.pipe(res);
//         });
//     });
// });

// // פונקציה שיצרתי לדוגמה ליצירת Stream טקסט
// function createLargeTextStream(largeText) {
//     const Readable = require("stream").Readable;
//     const textStream = new Readable();

//     // יצירת טקסט ארוך מאוד
//     // const largeText =
//     //     "זהו טקסט ארוך מאוד שיכול להיות מאות מילים או אפילו יותר. זהו דוגמה לשימוש ב-Stream ב-Express.";

//     // הגדרת הפונקציה _read
//     textStream._read = function () {
//         if (largeText.length === 0) {
//             // סיום הזרימה
//             this.push(null);
//         } else {
//             // קריאת חלק קטן מהטקסט והוספתו לזרם
//             const chunk = largeText.slice(0, 10); // קוראים 10 תווים בכל פעם
//             largeText = largeText.slice(10); // מעדכנים את הטקסט הנותר
//             this.push(chunk);
//         }
//     };

//     return textStream;
// }
// app.post("/api/convert", (req, res) => {
//     const { url } = req.body;
//     fetch(url).then((result) => {
//         const contentType = result.headers.get("Content-Type");
//         result.arrayBuffer().then((buffer) => {
//             const base64 =
//                 "data:image/jpeg;base64," + arrayBufferToBase64(buffer);
//             const [part1, part2, textLength] = splitText(base64);
//             console.log("TCL: part1", part1);
//             console.log("TCL: part2", part2);
//             console.log("TCL: textLength", textLength);
//             // res.json({ part1, part2, textLength });
//             res.send(part1 + "~" + part2 + "~" + textLength);
//             // res.send(base64);
//         });
//     });
// });

function arrayBufferToBase64(buffer) {
    var binary = "";
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return Buffer.from(binary, "binary").toString("base64");
}

// function splitText(text) {
//     const textLength = text.length;
//     // const halfLength = Math.ceil(textLength / 2);
//     const firstHalf = text.slice(0, textLength - 5000);
//     const secondHalf = text.slice(textLength - 5000);
//     return [firstHalf, secondHalf, textLength];
// }
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
