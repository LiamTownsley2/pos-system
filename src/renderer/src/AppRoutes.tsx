import { Navigate, Routes, Route } from 'react-router-dom'
import { useAuth } from './components/AuthContext'
import Layout from './layout'
import Home from './pages/Home'
import InboxPage from './pages/Inbox'
import InboxMessagePage from './pages/InboxMessage'
import SelectMember from './pages/point-of-sale/SelectMember'
import ResumeTransaction from './pages/point-of-sale/ResumeTransaction'
import PointOfSale from './pages/point-of-sale/PointOfSale'
import RegisterMember from './pages/RegisterMember'
import MemberLookup from './pages/MemberLookup'
import Inventory from './pages/Inventory'
import StaffManagement from './pages/StaffManagement'
import NotFound from './pages/NotFound'
import SalesReportPage from './pages/SalesReport'
import Login from './pages/Login'

export default function AppRoutes(): React.JSX.Element {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <p>Loading...</p>
  }

  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />

      {/* Protected routes */}
      <Route path="/*" element={user ? <Layout /> : <Navigate to="/login" replace />}>
        <Route index element={<Home />} />
        <Route path="inbox" element={<InboxPage />} />
        <Route path="inbox/:message_id" element={<InboxMessagePage />} />
        <Route path="pos" element={<SelectMember />} />
        <Route path="pos/resume-transaction" element={<ResumeTransaction />} />
        <Route path="pos/:member_id" element={<PointOfSale />} />
        <Route path="register-member" element={<RegisterMember />} />
        <Route path="sales-reports" element={<SalesReportPage />} />
        <Route path="member-lookup" element={<MemberLookup />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="staff-management" element={<StaffManagement />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
