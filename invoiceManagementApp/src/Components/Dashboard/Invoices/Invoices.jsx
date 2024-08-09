import React, { useEffect, useState } from "react";
import { db } from "../../../Firebase";
import {
  getDocs,
  collection,
  doc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import "./Invoices.css";
import { useNavigate } from "react-router-dom";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const Navigate = useNavigate();

  const fetchInvoices = async () => {
    setIsLoading(true);
    const invoiceCollection = query(
      collection(db, "invoice"),
      where("uid", "==", localStorage.getItem("uid"))
    );

    //const invoiceCollection = collection(db, "invoice");

    const invoiceSnapshots = await getDocs(invoiceCollection);

    const data = invoiceSnapshots.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setInvoices(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // Display the fetched invoices here
  const deleteInvoices = async (id) => {
    
    const isConfirm = window.confirm("Are you sure you want to delete this");
    if (isConfirm) {
      setIsLoading(true);
      try {
        
        const invoiceDoc = doc(db, "invoice", id);
        await deleteDoc(invoiceDoc);
        setInvoices((prevInvoices) =>
          prevInvoices.filter((invoice) => invoice.id !== id)
        );
        setIsLoading(false);
        // fetchInvoices(); ish ko bhi likh ne se delete ho jayega
        console.log(`Invoice with id ${id} deleted.`);
      } catch (error) {
        setIsLoading(false);
        console.error("Error deleting invoice:", error);
      }
    }
  };

  return (
    <>
      {
        isLoading ? <div className="loader"> <i style={{fontSize:"5rem",color:"green"}} className="fas fa-circle-notch fa-spin"></i></div>:
      <div className="">
      {invoices.map((invoice) => (
        <div key={invoice.id} className="invoice-data-fetch-box">
          <p className="invoice-p">
            <p className="invoice-p fb">To:</p> {invoice.to}
          </p>
          <p className="invoice-p">
            <p className="invoice-p fb">Address:</p> {invoice.address}
          </p>
          <p className="invoice-p">
            {" "}
            <p className="invoice-p fb">Phone:</p> {invoice.phone}
          </p>

          {/* <p className="invoice-p">
             <p className="invoice-p pr fb">Product List:</p>
            <div className="product-list"> <span>{invoice.productList.map((product) => product.productName)}</span></div>
          </p> */}

          <p className="invoice-p">
            {" "}
            <p className="invoice-p pr fb">Total Price:</p>
            {invoice.totalPrice}
          </p>
          <p className="invoice-p">
            <p className="invoice-p fb">Date: </p>
            {invoice.date.toDate().toLocaleString()}
          </p>
          <button
            className="invoice-delete-button"
            onClick={() => {
              deleteInvoices(invoice.id);
            }}
          >
            <i class="fa-solid fa-trash" style={{ paddingRight: "4px" }}></i>
            Delete {isLoading && <i class="fas fa-spinner fa-pulse"></i>}
          </button>
          <button
            className="invoice-delete-button"
            onClick={() => {
              Navigate("/dashboard/invoiceDetails", { state: invoice });
            }}
            style={{ backgroundColor: "royalblue" }}
          >
            <i class="fa-solid fa-eye" style={{ paddingRight: "4px" }}></i>
            View 
          </button>
        </div>
      ))} {invoices.length <1 &&     <div className="not-invoices">
        
        <p className="not-h1">You Have Not Any Invoice Yet..  Create New Invoice</p>
        <button onClick={() => Navigate("/dashboard/newInvoice")} className="not-invoices-button">
          <i class="fa-solid fa-plus" style={{ paddingRight: "4px" }}></i>
          Create New Invoice
        </button>

        </div>}
      </div> }
    </>
  );
};

export default Invoices;
