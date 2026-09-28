import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './theme/ThemeProvider';
import { AuthProvider } from './context/AuthContext';
import { FilterProvider } from './context/FilterContext';
import ProtectedRoute from './components/ProtectedRoute';
import RoleGuard from './components/RoleGuard';
import AppLayout from './components/AppLayout';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import ExecutiveDashboard from './dashboards/ExecutiveDashboard';
import MenuIntelligenceDashboard from './dashboards/MenuIntelligenceDashboard';
import CustomerIntelligenceDashboard from './dashboards/CustomerIntelligenceDashboard';
import WastageDashboard from './dashboards/WastageDashboard';
import SystemOperationsDashboard from './dashboards/SystemOperationsDashboard';
import DataPipelineUploadPage from './pages/DataPipelineUploadPage';
import DataPipelineResultsPage from './pages/DataPipelineResultsPage';
import RestaurantsManagementPage from './pages/RestaurantsManagementPage';
import RestaurantDetailsPage from './pages/RestaurantDetailsPage';
import OrdersPage from './pages/OrdersPage';
import PromotionsPage from './pages/PromotionsPage';
import RatingsPage from './pages/RatingsPage';
import InventoryPage from './pages/InventoryPage';
import MarketBasketPage from './pages/MarketBasketPage';
import PeakPeriodsPage from './pages/PeakPeriodsPage';
import LocationsChannelsPage from './pages/LocationsChannelsPage';
import DemandForecastingPage from './pages/LiveForecastPage';
import PricingPromotionsPage from './pages/PricingPromotionsPage';
import AnomaliesChurnPage from './pages/AnomaliesChurnPage';
import RecommendationsPage from './pages/RecommendationsPage';
import WhatIfSimulatorPage from './pages/WhatIfSimulatorPage';
import ModelRegistryPage from './pages/VerifiedModelsPage';
import DataGovernancePage from './pages/DataGovernancePage';
import ReportsPage from './pages/ReportsPage';
import AdminUsersAuditPage from './pages/AdminUsersAuditPage';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <FilterProvider>
            <ErrorBoundary>
              <Routes>
                {                              }
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />

                {                                       }
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  {              }
                  <Route path="dashboard" element={<ExecutiveDashboard />} />

                  {                }
                  <Route path="management/restaurants" element={<RestaurantsManagementPage />} />
                  <Route path="management/restaurants/:id" element={<RestaurantDetailsPage />} />
                  <Route path="management/menu" element={<MenuIntelligenceDashboard />} />
                  <Route path="management/customers" element={<CustomerIntelligenceDashboard />} />
                  <Route path="management/orders" element={<OrdersPage />} />
                  <Route path="management/promotions" element={<PromotionsPage />} />
                  <Route path="management/ratings" element={<RatingsPage />} />
                  <Route path="management/inventory" element={<InventoryPage />} />
                  <Route path="management/wastage" element={<WastageDashboard />} />

                  {                  }
                  <Route path="intelligence/menu" element={<MenuIntelligenceDashboard />} />
                  <Route path="intelligence/customer" element={<CustomerIntelligenceDashboard />} />
                  <Route path="intelligence/basket" element={<MarketBasketPage />} />
                  <Route path="intelligence/peak-periods" element={<PeakPeriodsPage />} />
                  <Route
                    path="intelligence/forecast"
                    element={
                      <RoleGuard allowedRoles={['analyst', 'regional_manager', 'admin']}>
                        <DemandForecastingPage />
                      </RoleGuard>
                    }
                  />
                  <Route path="intelligence/wastage" element={<WastageDashboard />} />
                  <Route path="intelligence/pricing" element={<PricingPromotionsPage />} />
                  <Route path="intelligence/locations" element={<LocationsChannelsPage />} />
                  <Route
                    path="intelligence/anomalies"
                    element={
                      <RoleGuard allowedRoles={['analyst', 'admin']}>
                        <AnomaliesChurnPage />
                      </RoleGuard>
                    }
                  />

                  {                 }
                  <Route
                    path="models/performance"
                    element={
                      <RoleGuard allowedRoles={['analyst', 'admin']}>
                        <ModelRegistryPage />
                      </RoleGuard>
                    }
                  />
                  <Route
                    path="models/comparison"
                    element={
                      <RoleGuard allowedRoles={['analyst', 'admin']}>
                        <ModelRegistryPage />
                      </RoleGuard>
                    }
                  />

                  {                      }
                  <Route path="decisions/recommendations" element={<RecommendationsPage />} />
                  <Route
                    path="decisions/what-if"
                    element={
                      <RoleGuard allowedRoles={['analyst', 'admin']}>
                        <WhatIfSimulatorPage />
                      </RoleGuard>
                    }
                  />

                  {                   }
                  <Route path="data/upload" element={<DataPipelineUploadPage />} />
                  <Route path="data/upload/runs/:runId/results" element={<DataPipelineResultsPage />} />
                  <Route path="data/overview" element={<DataGovernancePage initialTab="overview" />} />
                  <Route path="data/quality" element={<DataGovernancePage initialTab="quality" />} />
                  <Route path="data/cleaning" element={<DataGovernancePage initialTab="cleaning" />} />
                  <Route path="data/integration" element={<DataGovernancePage initialTab="integration" />} />
                  <Route path="data/features" element={<DataGovernancePage initialTab="features" />} />
                  <Route path="data/spark" element={<DataGovernancePage initialTab="spark" />} />

                  {                     }
                  <Route path="reports" element={<ReportsPage />} />
                  <Route
                    path="admin/users"
                    element={
                      <RoleGuard allowedRoles={['admin']}>
                        <AdminUsersAuditPage defaultTab="users" />
                      </RoleGuard>
                    }
                  />
                  <Route
                    path="admin/audit"
                    element={
                      <RoleGuard allowedRoles={['admin']}>
                        <AdminUsersAuditPage defaultTab="audit" />
                      </RoleGuard>
                    }
                  />
                  <Route
                    path="admin/models"
                    element={
                      <RoleGuard allowedRoles={['admin', 'analyst']}>
                        <ModelRegistryPage />
                      </RoleGuard>
                    }
                  />
                  <Route
                    path="system"
                    element={
                      <RoleGuard allowedRoles={['admin']}>
                        <SystemOperationsDashboard />
                      </RoleGuard>
                    }
                  />

                  {                                            }
                  <Route path="restaurants" element={<Navigate to="/management/restaurants" replace />} />
                  <Route path="menu" element={<Navigate to="/intelligence/menu" replace />} />
                  <Route path="customer" element={<Navigate to="/intelligence/customer" replace />} />
                  <Route path="orders" element={<Navigate to="/management/orders" replace />} />
                  <Route path="promotions" element={<Navigate to="/management/promotions" replace />} />
                  <Route path="ratings" element={<Navigate to="/management/ratings" replace />} />
                  <Route path="inventory" element={<Navigate to="/management/inventory" replace />} />
                  <Route path="wastage" element={<Navigate to="/intelligence/wastage" replace />} />
                  <Route path="basket" element={<Navigate to="/intelligence/basket" replace />} />
                  <Route path="peak-periods" element={<Navigate to="/intelligence/peak-periods" replace />} />
                  <Route path="forecast" element={<Navigate to="/intelligence/forecast" replace />} />
                  <Route path="pricing" element={<Navigate to="/intelligence/pricing" replace />} />
                  <Route path="locations" element={<Navigate to="/intelligence/locations" replace />} />
                  <Route path="anomalies" element={<Navigate to="/intelligence/anomalies" replace />} />
                  <Route path="comparison" element={<Navigate to="/models/comparison" replace />} />
                  <Route path="recommendations" element={<Navigate to="/decisions/recommendations" replace />} />
                  <Route path="what-if" element={<Navigate to="/decisions/what-if" replace />} />
                </Route>

                {               }
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </ErrorBoundary>
          </FilterProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
