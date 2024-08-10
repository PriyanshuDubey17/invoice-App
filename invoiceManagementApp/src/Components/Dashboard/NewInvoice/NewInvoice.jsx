import React, { useState } from "react";
import "./NewInvoice.css";
import { db } from "../../../Firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const NewInvoice = () => {
  const [newInvoiceFormData, setNewInvoiceFormData] = useState({
    to: "",
    phone: "",
    address: "",
    productName: "",
    price: "",
    quantity: "5",
  });

  const [totalProductPrice, setTotalProductPrice] = useState(0);
  const [listProduct, setListProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const Navigate = useNavigate();

  const addProduct = () => {
    // Validate the product data
    if (!newInvoiceFormData.productName || !newInvoiceFormData.price || !newInvoiceFormData.quantity) {
      alert("Please fill all product fields.");
      return;
    }

    // Check if price and quantity are valid numbers
    if (isNaN(newInvoiceFormData.price) || isNaN(newInvoiceFormData.quantity)) {
      alert("Price and quantity must be valid numbers.");
      return;
    }

    if (newInvoiceFormData.quantity <= 0) {
      alert("Quantity must be greater than 0.");
      return;
    }

    // Add the product to the list
    setListProduct([
      ...listProduct,
      {
        id: listProduct.length,
        productName: newInvoiceFormData.productName,
        price: newInvoiceFormData.price,
        quantity: newInvoiceFormData.quantity,
      },
    ]);

    const total = newInvoiceFormData.price * newInvoiceFormData.quantity;
    setTotalProductPrice(totalProductPrice + total);
    setNewInvoiceFormData({
      ...newInvoiceFormData,
      productName: "",
      price: "",
      quantity: "5",
    });
  };

  const handleNewInvoiceInputChange = (event) => {
    setNewInvoiceFormData((currentData) => ({
      ...currentData,
      [event.target.name]: event.target.value,
    }));
  };

  const saveAllData = async () => {
    // Validate invoice data
    if (!newInvoiceFormData.to || !newInvoiceFormData.phone || !newInvoiceFormData.address) {
      alert("Please fill all invoice fields.");
      return;
    }

    if (!listProduct.length) {
      alert("Please add at least one product.");
      return;
    }

    setIsLoading(true);

    try {
      const data = await addDoc(collection(db, "invoice"), {
        to: newInvoiceFormData.to,
        phone: newInvoiceFormData.phone,
        address: newInvoiceFormData.address,
        productList: listProduct,
        totalPrice: totalProductPrice,
        uid: localStorage.getItem("uid"),
        date: Timestamp.fromDate(new Date()),
      });

      console.log("Document written with ID: ", data.id);
      Navigate("/dashboard/invoices");
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Failed to save the invoice. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="heading">
        <h4 className="new-invoice-heading">New Invoice</h4>

        <button
          type="button"
          className="button-save-new-invoice"
          onClick={saveAllData}
        >
          Save Data {isLoading && <i className="fas fa-spinner fa-pulse"></i>}
        </button>
      </div>
      <form className="new-invoice-form">
        <div className="first-row-of-new-invoice">
          <input
            type="text"
            placeholder="To"
            className="new-invoice-input"
            value={newInvoiceFormData.to}
            name="to"
            onChange={handleNewInvoiceInputChange}
            required
          />
          <input
            type="number"
            placeholder="Phone"
            className="new-invoice-input"
            value={newInvoiceFormData.phone}
            name="phone"
            onChange={handleNewInvoiceInputChange}
           
            required
            
          />
          <input
            type="text"
            placeholder="Address"
            className="new-invoice-input"
            value={newInvoiceFormData.address}
            name="address"
            onChange={handleNewInvoiceInputChange}
            required
          />
        </div>

        <h4 className="new-invoice-heading">Add Products</h4>
        <div className="second-row-of-new-invoice">
          <input
            type="text"
            placeholder="Product Name"
            className="new-invoice-input"
            value={newInvoiceFormData.productName}
            name="productName"
            onChange={handleNewInvoiceInputChange}
            required
          />
          <input
            type="number"
            placeholder="Price"
            className="new-invoice-input"
            value={newInvoiceFormData.price}
            name="price"
            onChange={handleNewInvoiceInputChange}
            required
          />
          <input
            type="number"
            placeholder="Quantity"
            className="new-invoice-input"
            value={newInvoiceFormData.quantity}
            name="quantity"
            onChange={handleNewInvoiceInputChange}
            min={1}
            required
          />
        </div>
        <div className="new-invoice-button-div">
          <button
            type="button"
            className="button-new-invoice"
            onClick={addProduct}
          >
            Add Product
          </button>
        </div>
      </form>
      {listProduct.length > 0 && (
        <div className="product-Wrapper">
          <div className="product-div">
            <p className="p" style={{ fontWeight: "bold" }}>Sr No.</p>
            <p className="p" style={{ fontWeight: "bold" }}>Product Name</p>
            <p className="p" style={{ fontWeight: "bold" }}>Price</p>
            <p className="p" style={{ fontWeight: "bold" }}>Quantity</p>
            <p className="p" style={{ fontWeight: "bold" }}>Total Price</p>
          </div>
          {listProduct.map((product, index) => (
            <div key={index} className="product-div">
              <p className="p">{index + 1}</p>
              <p className="p">{product.productName}</p>
              <p className="p">{product.price}</p>
              <p className="p">{product.quantity}</p>
              <p className="p">{product.price * product.quantity}</p>
            </div>
          ))}
          <div className="total-wrapper">
            <p className="total-wrapper-p">Total Price: {totalProductPrice}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default NewInvoice;
