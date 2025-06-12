import './assets/main.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Layout from './layout'
import { HashRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import PointOfSale from './pages/PointOfSale'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<Home />} />
          <Route path="/pos" element={<PointOfSale />} />
        </Routes>
      </Layout>
    </HashRouter>
  </StrictMode>
)
