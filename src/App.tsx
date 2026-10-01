/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { TraceHoneyView } from './components/TraceHoneyView';
import { BeekeeperDashboard } from './components/BeekeeperDashboard';
import { QualityInspectorView } from './components/QualityInspectorView';
import { SupplyChainOperationsView } from './components/SupplyChainOperationsView';
import { SmartMonitoringView } from './components/SmartMonitoringView';
import { BlockchainExplorer } from './components/BlockchainExplorer';
import { AdminDashboard } from './components/AdminDashboard';
import { DatabaseSchemaView } from './components/DatabaseSchemaView';
import { ProjectDocsModal } from './components/ProjectDocsModal';
import { AuthModal } from './components/AuthModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [selectedBatchId, setSelectedBatchId] = useState<string>('HC-2026-00001');
  const [showDocsModal, setShowDocsModal] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  // Check URL pathname for /verify/:batchId support
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      if (pathname.includes('/verify/')) {
        const parts = pathname.split('/verify/');
        if (parts[1]) {
          const rawId = parts[1].replace(/[^a-zA-Z0-9-]/g, '').toUpperCase();
          if (rawId) {
            setSelectedBatchId(rawId);
            setActiveTab('trace');
          }
        }
      }
    }
  }, []);

  const handleSearchBatch = (batchId: string) => {
    setSelectedBatchId(batchId);
    setActiveTab('trace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateTab = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-stone-50/50 text-stone-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleNavigateTab}
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenDocs={() => setShowDocsModal(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'landing' && (
          <LandingPage
            onSearchBatch={handleSearchBatch}
            onNavigateTab={handleNavigateTab}
          />
        )}

        {activeTab === 'trace' && (
          <TraceHoneyView
            initialBatchId={selectedBatchId}
            onNavigateTab={handleNavigateTab}
            onInspectBlock={() => handleNavigateTab('blockchain')}
          />
        )}

        {activeTab === 'dashboard' && (
          <AdminDashboard
            onTraceBatch={handleSearchBatch}
            onNavigateTab={handleNavigateTab}
          />
        )}

        {activeTab === 'apiaries' && (
          <BeekeeperDashboard
            onNavigateTab={handleNavigateTab}
            onTraceBatch={handleSearchBatch}
          />
        )}

        {activeTab === 'quality' && (
          <QualityInspectorView
            onTraceBatch={handleSearchBatch}
            onNavigateTab={handleNavigateTab}
          />
        )}

        {activeTab === 'processing' && (
          <SupplyChainOperationsView
            initialSubTab="processing"
            onTraceBatch={handleSearchBatch}
            onNavigateTab={handleNavigateTab}
          />
        )}

        {activeTab === 'packaging' && (
          <SupplyChainOperationsView
            initialSubTab="packaging"
            onTraceBatch={handleSearchBatch}
            onNavigateTab={handleNavigateTab}
          />
        )}

        {activeTab === 'distribution' && (
          <SupplyChainOperationsView
            initialSubTab="distribution"
            onTraceBatch={handleSearchBatch}
            onNavigateTab={handleNavigateTab}
          />
        )}

        {activeTab === 'iot' && <SmartMonitoringView />}

        {activeTab === 'blockchain' && (
          <BlockchainExplorer onSelectBatch={handleSearchBatch} />
        )}

        {activeTab === 'schema' && <DatabaseSchemaView />}
      </main>

      {/* Global Modals */}
      <ProjectDocsModal
        isOpen={showDocsModal}
        onClose={() => setShowDocsModal(false)}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={(role) => {
          if (role === 'beekeeper') handleNavigateTab('apiaries');
          else if (role === 'inspector') handleNavigateTab('quality');
          else if (role === 'processor') handleNavigateTab('processing');
          else if (role === 'distributor') handleNavigateTab('distribution');
          else if (role === 'consumer') handleNavigateTab('trace');
          else handleNavigateTab('dashboard');
        }}
      />
    </div>
  );
}
