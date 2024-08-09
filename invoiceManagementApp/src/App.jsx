import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./Components/Dashboard/Dashboard";
import Home from "./Components/Dashboard/Home/Home";
import Invoices from "./Components/Dashboard/Invoices/Invoices";
import NewInvoice from "./Components/Dashboard/NewInvoice/NewInvoice";
import Setting from "./Components/Dashboard/Setting/Setting";
import InvoiceDetails from "./Components/Dashboard/InvoiceDetails/InvoiceDetails.jsx";

function App() {
  const myRouter = createBrowserRouter([
    { path: "", element: <Login /> },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    {
      path: "/dashboard",
      element: <Dashboard />,
      children: [
        { path: "", element: <Home /> },
        { path: "home", element: <Home /> },
        { path: "invoices", element: <Invoices /> },
        { path: "newInvoice", element: <NewInvoice /> },
        { path: "setting", element: <Setting /> },
        { path: "invoiceDetails", element: <InvoiceDetails /> },
        // Add more routes as needed for the dashboard sub-pages (invoices, clients, settings)
      ],
    },
  ]);
  return (
    <>
      <div className="">
        <RouterProvider router={myRouter} />
      </div>
    </>
  );
}

export default App;
