import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Products from "../pages/Products";
import Admin from "../pages/Admin";


export const router = createBrowserRouter([
    { path: '/', element: <Home /> },
    { path: 'product/:index/:chainId', element: <Products /> },
    { path: 'admin', element: <Admin /> },
]);
