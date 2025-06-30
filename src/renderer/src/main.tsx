import './assets/main.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Layout from './layout'
import { HashRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import PointOfSale from './pages/point-of-sale/PointOfSale'
import RegisterMember from './pages/RegisterMember'
import MemberLookup from './pages/MemberLookup'
import Inventory from './pages/Inventory'
import SelectMember from './pages/point-of-sale/SelectMember'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<Home />} />
          <Route path="/select-member" element={<SelectMember />} />
          <Route path="/select-member/pos/:user_id" element={<PointOfSale />} />
          <Route path="/register-member" element={<RegisterMember />} />
          <Route path="/member-lookup" element={<MemberLookup />} />
          <Route path="/inventory" element={<Inventory />} />
        </Routes>
      </Layout>
    </HashRouter>
  </StrictMode>
)
