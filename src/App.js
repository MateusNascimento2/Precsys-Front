import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

import Header from './components/Header';
import CPFLoginComponent from './components/CPFLoginComponent';
import PasswordLoginComponent from './components/PasswordLoginComponent';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Header />}>
          <Route index element={<CPFLoginComponent />} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;