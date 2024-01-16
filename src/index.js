import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import Protected from './Components/Protected';
import HomePage from './Components/Home/HomePage';
import AddMerchant from './Components/Add/AddMerchant';
import MerchantDetails from './Components/Details/MerchantDetails';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route path='loginSignup' element={<LoginSignup />} />
      <Route path='/' element={<Protected />} >
        <Route path='/' index element={<HomePage />} />
        <Route path="addMerchant" element={<AddMerchant />} />
        <Route path="/merchant-details/:merchantId" element={<MerchantDetails />} />
      </Route>
    </Route>
  ))

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router} />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
