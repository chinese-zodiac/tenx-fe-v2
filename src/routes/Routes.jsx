import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Products from "../pages/Products";
import EditSettings from "../pages/EditSettings";


export const router = createBrowserRouter([
    { path: '/', element: <Home /> },
    { path: 'product/:chainId/:index', element: <Products/> },
    { path: 'settings/:chainId/:index', element: <EditSettings/> },
]);
