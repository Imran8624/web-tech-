import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { AccessibilityToolbar } from './components/AccessibilityToolbar';
import { AIVoiceCallAgent } from './components/AIVoiceCallAgent';
import { LandingPage } from './views/LandingPage';
import { RiderDashboard } from './views/RiderDashboard';
import { CustomerTracker } from './views/CustomerTracker';
import { MerchantPortal } from './views/MerchantPortal';
import { SignAvatarLab } from './views/SignAvatarLab';
import { AuthLoginView } from './views/AuthLoginView';
import { AdminDashboard } from './views/AdminDashboard';

import { NotificationCenter, NotificationToast } from './components/NotificationCenter';
import { TransferOrderModal } from './components/TransferOrderModal';

const MainLayout = () => {
  const { currentView, isAuthenticated, user, transferModalState, closeTransferModal, activeSectorBg } = useApp();
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [isVoiceAgentOpen, setIsVoiceAgentOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    <div 
      className="min-h-screen flex flex-col text-slate-100 font-sans selection:bg-cyan-400 selection:text-slate-950 transition-colors duration-500 ease-in-out"
      style={{ backgroundColor: activeSectorBg || 'var(--active-sector-bg, #0F172A)' }}
    >
      
      {/* Top Navbar */}
      <Navbar 
        onOpenAccessibility={() => setIsAccessibilityOpen(true)} 
        onOpenVoiceAgent={() => setIsVoiceAgentOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
      />

      {/* Floating Push Notification Toast */}
      <NotificationToast />

      {/* Main View Router - Strict Role Portal Isolation */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* If Authenticated: ONLY the user's authorized role portal is rendered */}
        {isAuthenticated && user?.role === 'customer' && (
          <CustomerTracker onOpenVoiceAgent={() => setIsVoiceAgentOpen(true)} />
        )}
        {isAuthenticated && user?.role === 'rider' && (
          <RiderDashboard onOpenVoiceAgent={() => setIsVoiceAgentOpen(true)} />
        )}
        {isAuthenticated && user?.role === 'merchant' && (
          <MerchantPortal />
        )}
        {isAuthenticated && user?.role === 'admin' && (
          <AdminDashboard />
        )}

        {/* If Not Authenticated: Show Landing page or Portal Sign-In / Register */}
        {!isAuthenticated && (currentView === 'landing' ? <LandingPage /> : <AuthLoginView />)}
      </main>

      {/* Real-Time Notification Center Modal */}
      <NotificationCenter
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      {/* Global Accessibility Settings Toolbar */}
      <AccessibilityToolbar 
        isOpen={isAccessibilityOpen} 
        onClose={() => setIsAccessibilityOpen(false)} 
      />

      {/* Global AI Voice Call Dispatch Agent Modal */}
      <AIVoiceCallAgent
        isOpen={isVoiceAgentOpen}
        onClose={() => setIsVoiceAgentOpen(false)}
      />

      {/* Global Order Transfer to Nearby Rider Modal */}
      <TransferOrderModal
        isOpen={transferModalState.isOpen}
        onClose={closeTransferModal}
        initiatedBy={transferModalState.initiatedBy}
      />
    </div>
  );
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("SignShift App Error Boundary Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md bg-slate-900 border-2 border-cyan-500/60 rounded-3xl p-8 shadow-2xl space-y-4">
            <div className="text-4xl">🤟</div>
            <h2 className="text-2xl font-bold text-white">SignShift App Reset</h2>
            <p className="text-sm text-slate-400">
              {this.state.error?.message || "An unexpected display issue occurred."}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-extrabold rounded-xl shadow-lg hover:brightness-110 transition"
            >
              Reload SignShift
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
