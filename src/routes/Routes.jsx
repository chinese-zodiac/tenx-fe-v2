import { createBrowserRouter, createHashRouter } from "react-router-dom";
import Home from "../pages/Home";
import Products from "../pages/Products";
import EditSettings from "../pages/EditSettings";


export const router = createHashRouter([
    { path: '/', element: <Home /> },
    { path: 'product/:chainId/:index', element: <Products/> },
    { path: 'settings/:chainId/:index', element: <EditSettings/> },
]);
