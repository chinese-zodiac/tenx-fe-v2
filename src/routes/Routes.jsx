import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Products from "../pages/Products";
import EditSettings from "../pages/EditSettings";


export const router = createBrowserRouter([
    { path: '/', element: <Home /> },
    { path: 'product/:index/:chainId', element: <Products/> },
    { path: 'settings/:index', element: <EditSettings/> },
]);
