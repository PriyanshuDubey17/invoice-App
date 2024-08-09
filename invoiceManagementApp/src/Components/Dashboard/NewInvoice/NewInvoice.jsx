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
    console.log("handleInput");
    console.log("hii im name", event.target.name);
    console.log("hii im value", event.target.value);
    setNewInvoiceFormData((currentData) => {
      return { ...currentData, [event.target.name]: event.target.value };
    });
  }; // Function for handleChangeInput end here

  const saveAllData = async () => {
    setIsLoading(true);
    console.log(
      newInvoiceFormData.to,
      newInvoiceFormData.address,
      newInvoiceFormData.phone
    );
    console.log(listProduct);
    console.log(totalProductPrice);
    const data = await addDoc(collection(db, "invoice"), {
      to: newInvoiceFormData.to,
      phone: newInvoiceFormData.phone,
      address: newInvoiceFormData.address,
      productList: listProduct,
      totalPrice: totalProductPrice,
      uid: localStorage.getItem("uid"),
      date: Timestamp.fromDate(new Date()),
    });

    console.log("Document written with ID: ", data);
    Navigate("/dashboard/invoices");
    setIsLoading(false);
  };

  return (
    <>
      <div className="heading">
        <h4 className="new-invoice-heading"> New Invoice </h4>

        <button
          type="button"
          className="button-save-new-invoice"
          onClick={saveAllData}
        >
          Save Data  {isLoading && <i class="fas fa-spinner fa-pulse"></i>}
        </button>
      </div>
      <form className="new-invoice-form">
        <div className="first-row-of-new-invoice">
          <input
            type="text"
            placeholder="to"
            className="new-invoice-input"
            value={newInvoiceFormData.to}
            name="to"
            onChange={handleNewInvoiceInputChange}
          />
          <input
            type="number"
            placeholder="phone"
            className="new-invoice-input"
            value={newInvoiceFormData.phone}
            name="phone"
            onChange={handleNewInvoiceInputChange}
          />
          <input
            type="text"
            placeholder="address"
            className="new-invoice-input"
            value={newInvoiceFormData.address}
            name="address"
            onChange={handleNewInvoiceInputChange}
          />
        </div>

        <h4 className="new-invoice-heading"> Add Products </h4>
        <div className="second-row-of-new-invoice">
          <input
            type="text"
            placeholder="Product Name"
            className="new-invoice-input"
            value={newInvoiceFormData.productName}
            name="productName"
            onChange={handleNewInvoiceInputChange}
          />
          <input
            type="number"
            placeholder="Price"
            className="new-invoice-input"
            value={newInvoiceFormData.price}
            name="price"
            onChange={handleNewInvoiceInputChange}
          />
          <input
            type="number"
            placeholder="Quantity"
            className="new-invoice-input"
            value={newInvoiceFormData.quantity}
            name="quantity"
            onChange={handleNewInvoiceInputChange}
            min={1}
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
            <p className="p" style={{ fontWeight: "bold" }}>
              {" "}
              Sr No.
            </p>
            <p className="p" style={{ fontWeight: "bold" }}>
              Product Name
            </p>
            <p className="p" style={{ fontWeight: "bold" }}>
              Price
            </p>
            <p className="p" style={{ fontWeight: "bold" }}>
              Quantity
            </p>
            <p className="p" style={{ fontWeight: "bold" }}>
              Total Price
            </p>
          </div>
          {
            listProduct.map((product, index) => (
              <div key={index} className="product-div">
                <p className="p">{index + 1}</p>
                <p className="p">{product.productName}</p>
                <p className="p">{product.price}</p>
                <p className="p">{product.quantity}</p>
                <p className="p">{product.price * product.quantity}</p>
              </div>
            ))

            // Add Total Price and Tax Calculation Here
          }
          <div className="total-wrapper">
            {" "}
            <p className="total-wrapper-p">Total Price :{totalProductPrice}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default NewInvoice;
