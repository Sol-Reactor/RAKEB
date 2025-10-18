import { sql } from '../config/db.js';

export const getProducts = async (req, res) => {
    // Logic to get all products
   try {
       const products = await sql`SELECT * FROM products ORDER BY created_at DESC`;
   
    res.status(200).json({success:true,data: products });
   } catch (error) {
       console.error("Error fetching products:", error);
       return res.status(500).json({ error: "Internal Server Error" });
   }
}


export const createProduct = async (req, res) => {
    // Guard against missing/invalid JSON body (e.g., client didn't set Content-Type)
    if (!req.body || typeof req.body !== 'object') {
        return res.status(400).json({ error: 'Request body is missing or invalid JSON. Set Content-Type: application/json and provide a JSON body.' });
    }

    const { name, image, price } = req.body;

    if (!name || !image || !price) {
        return res.status(400).json({ error: "Name, image, and price are required" });
    }
   try {
       
       const newProduct = await sql`
           INSERT INTO products (name, image, price)
           VALUES (${name}, ${image}, ${price})
           RETURNING *
       `;
       return res.status(201).json({success:true,data: newProduct[0]});
   } catch (error) {
       console.error("Error creating product:", error);
       return res.status(500).json({ error: "Internal Server Error" });
   }
};

export const getProductById = async (req, res) => {
    // Logic to get a single product by ID
   try {
       const { id } = req.params;
       const parsedId = Number(id);
       if (!Number.isInteger(parsedId) || parsedId <= 0) {
           return res.status(400).json({ error: 'Invalid product id' });
       }
       const product = await sql`SELECT * FROM products WHERE id = ${parsedId}`;
       if (product.length === 0) {
           return res.status(404).json({ error: "Product not found" });
       }
       return res.json(product[0]);
   } catch (error) {
       console.error("Error fetching product:", error);
       return res.status(500).json({ error: "Internal Server Error" });
   }
};


export const updateProduct = async (req, res) => {
    // Logic to update a product
   try {
        // Validate id param
        const { id } = req.params;
        const parsedId = Number(id);
        if (!Number.isInteger(parsedId) || parsedId <= 0) {
            return res.status(400).json({ error: 'Invalid product id' });
        }

        // Validate request body
        if (!req.body || typeof req.body !== 'object') {
            return res.status(400).json({ error: 'Request body is missing or invalid JSON. Set Content-Type: application/json.' });
        }

        const { name, image, price } = req.body;
       const updatedProduct = await sql`
           UPDATE products
           SET name = ${name}, image = ${image}, price = ${price}
           WHERE id = ${id}
           RETURNING *
       `;
       if (updatedProduct.length === 0) {
           return res.status(404).json({ error: "Product not found" });
       }
       return res.json(updatedProduct[0]);
   } catch (error) {
       console.error("Error updating product:", error);
       return res.status(500).json({ error: "Internal Server Error" });
   }
};

export const deleteProduct = async (req, res) => {
   try {
       const { id } = req.params;
       const deletedProduct = await sql`
           DELETE FROM products
           WHERE id = ${id}
           RETURNING *
       `;
       if (deletedProduct.length === 0) {
           return res.status(404).json({ error: "Product not found" });
       }
       return res.json(deletedProduct[0]);
   } catch (error) {
       console.error("Error deleting product:", error);
       return res.status(500).json({ error: "Internal Server Error" });
   }
};


