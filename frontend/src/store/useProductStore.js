import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

// base url will be dynamic depending on the environment
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "";

export const useProductStore = create((set, get) => ({
  // products state
  products: [],
  loading: false,
  error: null,
  currentProduct: null,

  // form state
  formData: {
    name: "",
    price: "",
    image: "",
  },

  setFormData: (formData) => set({ formData }),
  resetForm: () => set({ formData: { name: "", price: "", image: "" } }),

  addProduct: async (e) => {
    e.preventDefault();
    set({ loading: true });

    try {
      const { formData } = get();
      await axios.post(`${BASE_URL}/api/products`, formData);
      await get().fetchProducts();
      get().resetForm();
      toast.success("Product added successfully");
      document.getElementById("add_product_modal").close();
    } catch (error) {
      console.log("Error in addProduct function", error);
      toast.error("Something went wrong");
    } finally {
      set({ loading: false });
    }
  },

  addProducts: async (e) => {
   e.preventDefault();
    set({ loading: true });

    try {
      const { formData } = get();
      await axios.post(`${BASE_URL}/api/products/bulk`, formData);
      await get().fetchProducts();
      get().resetForm();
      toast.success("Products added successfully");
      document.getElementById("add_products_modal").close();
    } catch (error) {
      console.log("Error in addProducts function", error);
      toast.error("Something went wrong");
    } finally {
      set({ loading: false });
    }
  },

  fetchProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${BASE_URL}/api/products`);
      set({ products: response.data.data, error: null });
    } catch (err) {
      // Use functional update to avoid overwriting the entire state
      if (err.status == 429) {
        set((state) => ({ ...state, error: "Rate limit exceeded", products: [] }));
      } else {
        set((state) => ({ ...state, error: "Something went wrong", products: [] }));
      }
    } finally {
      set({ loading: false });
    }
  },

  deleteProduct: async (id) => {
    console.log("deleteProduct function called", id);
    set({ loading: true });
    try {
      await axios.delete(`${BASE_URL}/api/products/${id}`);
      // Update the local state by filtering out the deleted product.
      // Use non-strict comparison ( `!=` ) to handle string vs. number IDs,
      // and also check for `_id` which is common with MongoDB.
      set((state) => ({
        products: state.products.filter((p) => p.id != id && p._id != id),
      }));
      toast.success("Product deleted successfully");
    } catch (error) {
      console.log("Error in deleteProduct function", error);
      toast.error("Something went wrong");
    } finally {
      set({ loading: false });
    }
  },

  fetchProduct: async (id) => {
    set({ loading: true });
    try {
      const response = await axios.get(`${BASE_URL}/api/products/${id}`);
      set({
        currentProduct: response.data,
        formData: response.data, // pre-fill form with current product data
        error: null,
      });
    } catch (error) {
      console.log("Error in fetchProduct function", error);
      set({ error: "Something went wrong", currentProduct: null });
    } finally {
      set({ loading: false });
    }
  },
  updateProduct: async (id) => {
    set({ loading: true });
    try {
      const { formData } = get();
      const response = await axios.put(`${BASE_URL}/api/products/${id}`, formData);
      set({ currentProduct: response.data });
      toast.success("Product updated successfully");
    } catch (error) {
      toast.error("Something went wrong");
      console.log("Error in updateProduct function", error);
    } finally {
      set({ loading: false });
    }
  },
}));