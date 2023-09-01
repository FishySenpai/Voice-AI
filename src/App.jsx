import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Home from './Home'
import Login from './Login';
import Register from './Register';
import DrawerAppBar from "./Navbar"
import User from './User';
function App() {

  return (
    <>
      <div className="App">
        <Router>
          <DrawerAppBar />
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Home />
                </>
              }
            />
            <Route
              path="/login"
              element={
                <>
                  <Login />
                </>
              }
            />
            <Route
              path="/register"
              element={
                <>
                  <Register />
                </>
              }
            />{" "}
            <Route
              path="/user"
              element={
                <>
                  <User />
                </>
              }
            />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App
