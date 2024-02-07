import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

import Header from './components/Header';
import Login from './pages/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Header />}>
          <Route index element={<Login />} />

        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;