import Product from "../Product/Product";
import "./Products.css";

function Products({ products }) {
    return (
        <section className="products">
            {products.map((item) => (
                <Product
                    key={item.id}
                    image={item.image}
                    title={item.title}
                    price={item.price}
                />
            ))}
        </section>
    );
}

export default Products;
