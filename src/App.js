/* eslint-disable no-unused-vars */
/* eslint-disable import/no-duplicates */
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import ProductListingPage from './components/productListingPage'
import ProductDetailsPage from './components/productDetailsPage'
import { BrowserRouter } from 'react-router-dom'
import Cart from './components/cart'

class App extends React.Component {
  render () {
    return <div className="App">
    <BrowserRouter>
      <header className="App-header">
        <Header></Header>
      </header>
        <Routes>
          <Route path="/" element={<ProductListingPage />} />
          <Route path="/pdp/:id" element={<ProductDetailsPage/>}/>
          <Route path="/cart" element={<Cart/>}/>
        </Routes>
    </BrowserRouter>
  </div>
  }
}

export default App
