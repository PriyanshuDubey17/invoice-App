import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./InvoiceDetails.css";
import html2canvas from "html2canvas";

import jsPDF from "jspdf";

const InvoiceDetails = () => {
  const location = useLocation();
  const [invoiceDetailsData, setInvoiceDetailsData] = useState(location.state);
  const [isLoading, setIsLoading] = useState(false);

  // console.log(invoiceDetailsData);

  const printInvoice = () => {
    setIsLoading(true);
    const inputData = document.getElementById("pdfData");
    
    // Check if inputData is null or undefined
    if (!inputData) {
      
      console.error("Element with id 'pdfData' not found");
      return;
    }

    html2canvas(inputData, { useCORS: true })
      .then((canvas) => {
        const imageData = canvas.toDataURL("image/png", 1.0);
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "pt",
          format: "a4", // You can use "a4" or a custom size if needed
        });

        try {
          const imageProps = pdf.getImageProperties(imageData);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imageProps.height * pdfWidth) / imageProps.width;

          // Adjust the image placement on the PDF
          pdf.addImage(imageData, "PNG", 0, 0, pdfWidth, pdfHeight);
          pdf.save("invoice.pdf");
          setIsLoading(false);
        } catch (error) {
          setIsLoading(false);
          console.error("Error generating PDF:", error);
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error rendering HTML to canvas:", error);
      });
  };

  return (
    <>
    
      <div className="print-div">
        <button className="print-btn" onClick={printInvoice}>
          Print {isLoading && <i class="fas fa-spinner fa-pulse"></i>}
        </button>
      </div>
      <div className="invoice-details-wrapper" id="pdfData">
        <div className="invoice-details-header">
          <div className="company-details">
            <img
              src={localStorage.getItem("imageUrl")}
              alt="company-logo"
              className="company-logo"
            />
            <h3 className="company-name">
              {localStorage.getItem("companyName")}
            </h3>
            <p style={{ color: "royalblue" }}>
              {localStorage.getItem("email")}
            </p>
          </div>
          <div className="customer-details">
            <h2 style={{ color: "royalblue" }}>Invoice</h2>
            <p>To: {invoiceDetailsData.to}</p>

            <p>Address: {invoiceDetailsData.address}</p>

            <p>Country:India</p>

            <p>Phone:{invoiceDetailsData.phone}</p>
          </div>
        </div>
        <div className="invoice-details-table">
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Sr No</th>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Sub Total</th>
              </tr>
            </thead>
            <tbody>
              {invoiceDetailsData.productList.map((product, index) => {
                return (
                  <tr key={index.id}>
                    <td>{index + 1}</td>
                    <td>{product.productName}</td>

                    <td>{product.quantity}</td>
                    <td>{product.price}</td>
                    <td>{product.price * product.quantity}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td
                  colSpan="4"
                  style={{ color: "royalblue", fontWeight: "bold" }}
                >
                  {" "}
                  Total Price
                </td>
                <td style={{ color: "royalblue", fontWeight: "bold" }}>
                  {invoiceDetailsData.totalPrice}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <p>
          Date:{" "}
          {new Date().toLocaleDateString("IND", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>
      </div>
    </>
  );
};

export default InvoiceDetails;
