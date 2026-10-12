import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/layout/Sidebar';
import type { PageId } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { AccessRestricted } from './components/common/AccessRestricted';
import { LoginPage } from './pages/LoginPage';

import { DashboardPage } from './pages/DashboardPage';
import { AnalystDashboardPage } from './pages/AnalystDashboardPage';
import { DatasetPage } from './pages/DatasetPage';
import { DataQualityPage } from './pages/DataQualityPage';
import { EtlPage } from './pages/EtlPage';
import { WarehouseSchemaPage } from './pages/WarehouseSchemaPage';
import { SalesAnalyticsPage } from './pages/SalesAnalyticsPage';
import { ProductAnalyticsPage } from './pages/ProductAnalyticsPage';
import { CustomerAnalyticsPage } from './pages/CustomerAnalyticsPage';
import { GeographicAnalyticsPage } from './pages/GeographicAnalyticsPage';
import { RfmPage } from './pages/RfmPage';
import { ClusteringPage } from './pages/ClusteringPage';
import { ClassificationPage } from './pages/ClassificationPage';
import { FeatureImportancePage } from './pages/FeatureImportancePage';
import { AprioriPage } from './pages/AprioriPage';
import { MarketBasketPage } from './pages/MarketBasketPage';
import { ModelEvaluationPage } from './pages/ModelEvaluationPage';
import { BusinessInsightsPage } from './pages/BusinessInsightsPage';
import { ReportsPage } from './pages/ReportsPage';
import { UserManagementPage } from './pages/UserManagementPage';
import { SettingsPage } from './pages/SettingsPage';

export const MainAppContent: React.FC = () => {
  const { isAuthenticated, role, isAdmin, authLoading } = useAuth();
  
  const [activePage, setActivePage] = useState<PageId>(() => {
    const saved = localStorage.getItem('app_active_page') as PageId;
    return saved || 'dashboard';
  });

  const [sidebarWidth, setSidebarWidth] = useState<number>(() => {
    const saved = localStorage.getItem('app_sidebar_width');
    return saved ? parseInt(saved, 10) : 256;
  });

  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    const saved = localStorage.getItem('app_sidebar_collapsed');
    return saved === 'true';
  });

  useEffect(() => {
    if (activePage) {
      localStorage.setItem('app_active_page', activePage);
    }
  }, [activePage]);

  useEffect(() => {
    localStorage.setItem('app_sidebar_width', sidebarWidth.toString());
  }, [sidebarWidth]);

  useEffect(() => {
    localStorage.setItem('app_sidebar_collapsed', sidebarCollapsed.toString());
  }, [sidebarCollapsed]);

  const [overviewData, setOverviewData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Adjust default page based on role when role loads/changes
  useEffect(() => {
    if (role === 'analyst' && ['dashboard', 'dataset', 'data-quality', 'etl', 'warehouse', 'model-evaluation', 'feature-importance', 'users', 'settings'].includes(activePage)) {
      setActivePage('analyst-dashboard');
    }
  }, [role, activePage]);

  useEffect(() => {
    if (isAuthenticated) {
      axios.get('http://127.0.0.1:8000/api/overview')
        .then(res => setOverviewData(res.data))
        .catch(err => console.error('Overview fetch error:', err))
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-400">Loading Smart Retail Platform...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, render Login Page (placed AFTER all hooks)
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const adminOnlyPages: PageId[] = [
    'dashboard',
    'dataset',
    'data-quality',
    'etl',
    'warehouse',
    'model-evaluation',
    'feature-importance',
    'users',
    'settings'
  ];

  const renderPage = () => {
    // Route Protection Guard for Analyst Role
    if (!isAdmin && adminOnlyPages.includes(activePage)) {
      return <AccessRestricted onGoBack={() => setActivePage('analyst-dashboard')} />;
    }

    switch (activePage) {
      case 'dashboard':
        return <DashboardPage data={overviewData} loading={loading} />;
      case 'analyst-dashboard':
        return <AnalystDashboardPage data={overviewData} loading={loading} />;
      case 'dataset':
        return <DatasetPage />;
      case 'data-quality':
        return <DataQualityPage />;
      case 'etl':
        return <EtlPage />;
      case 'warehouse':
        return <WarehouseSchemaPage />;
      case 'sales':
        return <SalesAnalyticsPage />;
      case 'products':
        return <ProductAnalyticsPage />;
      case 'customers':
        return <CustomerAnalyticsPage />;
      case 'geographic':
        return <GeographicAnalyticsPage />;
      case 'rfm':
        return <RfmPage />;
      case 'clustering':
        return <ClusteringPage />;
      case 'classification':
        return <ClassificationPage />;
      case 'feature-importance':
        return <FeatureImportancePage />;
      case 'association':
        return <AprioriPage />;
      case 'market-basket':
        return <MarketBasketPage />;
      case 'model-evaluation':
        return <ModelEvaluationPage />;
      case 'insights':
        return <BusinessInsightsPage />;
      case 'reports':
        return <ReportsPage />;
      case 'users':
        return <UserManagementPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return isAdmin ? <DashboardPage data={overviewData} loading={loading} /> : <AnalystDashboardPage data={overviewData} loading={loading} />;
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 transition-colors">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        sidebarWidth={sidebarWidth}
        setSidebarWidth={setSidebarWidth}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header activePage={activePage} />
        <main className="flex-1">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}

export default App;
