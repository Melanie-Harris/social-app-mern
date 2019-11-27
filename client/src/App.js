import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from "./components/layout/Navbar";


function App() {
  return (
    <div className="App">
     <h1>React!!!</h1>
     <Navbar/>
    </div>
  );
}

export default App;
