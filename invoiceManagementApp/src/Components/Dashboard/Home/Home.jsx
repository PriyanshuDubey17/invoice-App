import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import "./Home.css";
import { db } from "../../../Firebase";
import { getDocs, collection, query, where } from "firebase/firestore";

const Home = () => {
  const [total, setTotal] = useState(0);
  const [totalThisMonth, setTotalThisMonth] = useState(0);
  const [invoices, setInvoices] = useState([]);
  
  //const [isLoading, setIsLoading] = useState(false);

  
  

  const fetchInvoices = async () => {
    //setIsLoading(true);
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
    console.log(data);
    overAllTotal(data);
    totalThisMonthInvoices(data);
    showGraphData(data);
   // setIsLoading(false);
  };

  const overAllTotal = (invoiceListTotalPrice) => {
    let totalAmount = 0;
    invoiceListTotalPrice.forEach((data) => {
      totalAmount += data.totalPrice;
    });
    console.log(totalAmount);
    setTotal(totalAmount);
  };

  const totalThisMonthInvoices = (invoiceListTotalPrice) => {
    let totalAmount = 0;
    invoiceListTotalPrice.forEach((data) => {
      const date = new Date(data.date.seconds * 1000);
      const currentDate = new Date();
      if (date.getMonth() === currentDate.getMonth()) {
        totalAmount += data.totalPrice;
      }
    });
    console.log(totalAmount);
    setTotalThisMonth(totalAmount);
  };

  // Create a ref to store the chart instance
  const chartRef = useRef(null);

  const showGraphData = (data) => {
    const chartData = {
      January: 0,
      February: 0,
      March: 0,
      April: 0,
      May: 0,
      June: 0,
      July: 0,
      August: 0,
      September: 0,
      October: 0,
      November: 0,
      December: 0,
    };
    console.log(Object.keys(chartData));

    data.forEach((invoiceThisYearData) => {
      if (
        new Date(invoiceThisYearData.date.seconds * 1000).getFullYear() ==
        new Date().getFullYear()
      ) {
        //console.log(invoiceThisYearData);
        // console.log(new Date(invoiceThisYearData.date.seconds*1000).toLocaleDateString('default', {month:"long"}));
        chartData[
          new Date(invoiceThisYearData.date.seconds * 1000).toLocaleDateString(
            "default",
            { month: "long" }
          )
        ] += invoiceThisYearData.totalPrice;

        //chartData[Object.keys(chartData)[month-1]]+=invoiceThisYearData.totalPrice;
      }
    });
    console.log(chartData);
    createChartData(chartData);
  };

  const createChartData = (chartData) => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Create the new chart
    const ctx = document.getElementById("myChart");

    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: Object.keys(chartData),
        datasets: [
          {
            label: "# of Votes",
            data: Object.values(chartData),
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    // Cleanup function to destroy the chart instance on unmount
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  };

  useEffect(() => {
    // Fetch the invoices when the component mounts
    fetchInvoices();
    //createChartData();
    // Clean up existing chart instance if it exists
  }, []);

  return (
    <>
          {/* isLoading ? <div className="loader"> <i style={{fontSize:"5rem",color:"green"}} className="fas fa-circle-notch fa-spin"></i></div>: */}

    <div>
      
      <div className="home-first-row">
        <div className="home-box box-1">
          <h2> Total Invoices Price </h2>
          <h1> Rs:-{total}</h1>
        </div>
        <div className="home-box box-2">
          <h2> All invoices</h2>
          <h1> No-{invoices.length}</h1>
        </div>
        <div className="home-box box-3">
          <h2> This Month invoices</h2>
          <h1> Rs:-{totalThisMonth}</h1>
        </div>
      </div>

      <div className="home-second-row">
        <div className="chart-box">
          <canvas id="myChart"></canvas>
        </div>

        <div className="recent-invoices">
          <h2>Recent Invoice List</h2>
          <div className="recent-invoices-inner-div">
            <p style={{fontWeight:"bold"}}>Customer</p>
            <p style={{fontWeight:"bold"}} className="hidden"> Date </p>
            <p style={{fontWeight:"bold"}}> Total </p>
          </div> 
          <div className="">
            {
              invoices.slice(0, 5).map((invoice) => (
                <div key={invoice.id} className="recent-invoices-inner-div">
                  <p >{invoice.to}</p>
                  <p className="recentData-p hidden">{new Date(invoice.date.seconds * 1000).toLocaleDateString('IND', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                  <p>{invoice.totalPrice}</p>
                </div>
              ))
            }
          </div>
        </div>
      </div>

    </div></>
  );
};

export default Home;
