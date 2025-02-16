import { createBrowserRouter } from "react-router-dom";
import MainLayOut from "../LayOut/MainLayOut";
import Home from "../Pages/Home/Home";
import Error from "../Pages/Error/Error";
import DashBoard from "../LayOut/Dashboard";
import Login from "../Authentication/Login";
import Signup from "../Authentication/Signup";
import AddItem from "../Pages/Dashboard/Seller/AddItem/AddItem";
import AllProducts from "../Pages/AllProducts/AllProducts";
import CardDetails from "../Pages/AllProducts/CardDetails";
import MyOrder from "../Pages/Dashboard/Customer/MYOrder/MyOrder";
import ManageUsers from "../Pages/Dashboard/Admin/ManageUsres/ManageUsers";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import SellerRoute from "./SellerRoute";
import SellerData from "../Pages/Dashboard/Admin/SellerData/SellerData";
import ViewDetails from "../Pages/Dashboard/Admin/SellerData/ViewDetails";
import MyInventory from "../Pages/Dashboard/Seller/My Inventory/MyInventory";
import ManageOrder from "../Pages/Dashboard/Customer/ManageOrder/ManageOrder";
import EditInventory from "../Pages/Dashboard/Seller/My Inventory/EditInventory";
import BecomeSeller from "../Pages/Dashboard/Customer/BecomeSeller/BecomeSeller";
import AddToCart from "../Pages/Dashboard/Customer/AddToCart/AddToCart";
import Profile from "../Pages/Dashboard/All/Profile";
import SellerStatistics from "../Pages/Dashboard/Seller/SellerStatistics/SellerStatistics";
import Statistics from "../Pages/Dashboard/Admin/Statistics/Statistics";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayOut></MainLayOut>,
        errorElement: <Error></Error>,
        children: [
            {
                path: '/',
                element: <Home></Home>
            },
            {
                path: '/login',
                element: <Login></Login>
            },
            {
                path: '/signup',
                element: <Signup></Signup>
            },
            {
                path: '/products',
                element: <AllProducts></AllProducts>
            },
            {
                path: '/product/:id',
                element: <PrivateRoute><CardDetails></CardDetails></PrivateRoute>
            },
        ],
    },
    {
        path: '/dashboard',
        element: <PrivateRoute><DashBoard></DashBoard></PrivateRoute>,
        children:[
            {
                path:'Statistics',
                element:<PrivateRoute><AdminRoute><Statistics></Statistics></AdminRoute></PrivateRoute>
            },
            {
                path:'manage-users',
                element:<PrivateRoute><AdminRoute><ManageUsers></ManageUsers></AdminRoute></PrivateRoute>
            },
            {
                path:'seller-data',
                element:<PrivateRoute><AdminRoute><SellerData></SellerData></AdminRoute></PrivateRoute>
            },
            {
                path:'/dashboard/seller/:id',
                element:<PrivateRoute><AdminRoute><ViewDetails></ViewDetails></AdminRoute></PrivateRoute>
            },



            {
                path:'seller-statistics',
                element:<PrivateRoute><SellerRoute><SellerStatistics></SellerStatistics></SellerRoute></PrivateRoute>
            },
            {
                path:'addItem',
                element:<PrivateRoute><SellerRoute><AddItem></AddItem></SellerRoute></PrivateRoute>
            },
            {
                path:'my-inventory',
                element:<PrivateRoute><SellerRoute><MyInventory></MyInventory></SellerRoute></PrivateRoute>
            },
            {
                path:'edit-products/:id',
                element:<PrivateRoute><SellerRoute><EditInventory>a</EditInventory></SellerRoute></PrivateRoute>
            },
            {
                path:'manage-orders',
                element:<PrivateRoute><SellerRoute><ManageOrder></ManageOrder></SellerRoute></PrivateRoute>
            },





            {
                path:'my-orders',
                element:<MyOrder></MyOrder>
            },
            {
                path:'become-seller',
                element:<BecomeSeller></BecomeSeller>
            },
            {
                path:'add-to-cart',
                element:<AddToCart></AddToCart>
            },



            {
                path:'profile',
                element:<Profile></Profile>
            }
        ]
    }
]);
