import { Routes, Route } from 'react-router-dom';

import PublicLayout from '../layouts/PublicLayout';
import BuyerLayout from '../layouts/BuyerLayout';
import SupplierLayout from '../layouts/SupplierLayout';

import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import BuyerRoute from './BuyerRoute';
import SupplierRoute from './SupplierRoute';

import PagePlaceholder from '../components/common/PagePlaceholder';
import LandingPage from '../pages/LandingPage';
import MarketplacePage from '../pages/MarketplacePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import OrdersListPage from '../pages/OrdersListPage';
import OrderDetailPage from '../pages/OrderDetailPage';

// Phase 2 replaced the Home and Marketplace placeholders with the real
// pages; Phase 4 replaces Login/Register. This pass replaces the buyer
// shopping flow (Product Detail, Cart, Checkout, My Orders, Order Detail).
// Everything else still uses PagePlaceholder — onboarding, profile, and
// the supplier flow come in later phases.
const AppRoutes = () => (
  <Routes>
    <Route element={<PublicLayout />}>
      {/* Fully public — no guard. Cart works for guests too (see cartApi.js). */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/marketplace" element={<MarketplacePage />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/supplier/:id" element={<PagePlaceholder name="Supplier Storefront" />} />

      {/* Guest-only — redirects to the user's dashboard if already logged in. */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Any authenticated user, role-agnostic — ownership/role is checked
          backend-side for these (e.g. GET /orders/:id allows either the
          buyer or supplier owner). */}
      <Route element={<ProtectedRoute />}>
        <Route path="/onboarding/buyer" element={<PagePlaceholder name="Buyer Onboarding" />} />
        <Route
          path="/onboarding/supplier"
          element={<PagePlaceholder name="Supplier Onboarding" />}
        />
        <Route path="/profile" element={<PagePlaceholder name="Profile" />} />
        <Route path="/orders/:id" element={<OrderDetailPage />} />
      </Route>

      {/* Buyer-only, but rendered with the storefront chrome (navbar/footer)
          rather than the dashboard shell — checkout is a continuation of
          shopping, not a dashboard task. BuyerRoute (not ProtectedRoute)
          on purpose: a guest is bounced to /login and back via
          location.state.from, while a logged-in supplier is redirected
          away instead of reaching the form and hitting a 403 on submit —
          the backend already enforces buyer-only order placement, this
          just guides the user there before they waste a submit. */}
      <Route element={<BuyerRoute />}>
        <Route path="/checkout" element={<CheckoutPage />} />
      </Route>
    </Route>

    {/* Buyer-only area */}
    <Route element={<BuyerRoute />}>
      <Route element={<BuyerLayout />}>
        <Route path="/buyer/dashboard" element={<PagePlaceholder name="Buyer Dashboard" />} />
        <Route path="/orders" element={<OrdersListPage />} />
      </Route>
    </Route>

    {/* Supplier-only area */}
    <Route element={<SupplierRoute />}>
      <Route element={<SupplierLayout />}>
        <Route path="/supplier/dashboard" element={<PagePlaceholder name="Supplier Dashboard" />} />
        <Route path="/supplier/products" element={<PagePlaceholder name="My Products" />} />
        <Route path="/supplier/orders" element={<PagePlaceholder name="Incoming Orders" />} />
      </Route>
    </Route>

    <Route element={<PublicLayout />}>
      <Route path="*" element={<PagePlaceholder name="404 Not Found" />} />
    </Route>
  </Routes>
);

export default AppRoutes;
