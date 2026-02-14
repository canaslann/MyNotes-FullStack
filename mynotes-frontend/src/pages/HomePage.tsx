import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { EditorPage } from '@/pages/EditorPage';

export const HomePage: React.FC = () => {
  const [currentPageId, setCurrentPageId] = useState<string | null>(null);

  const handlePageSelect = (pageId: string) => {
    // Boş string gelirse null yap
    setCurrentPageId(pageId || null);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        onPageSelect={handlePageSelect}
        currentPageId={currentPageId}
        isOpen={true}
        onClose={() => {}}
      />
      <EditorPage 
        pageId={currentPageId}
        onMenuToggle={() => {}}
      />
    </div>
  );
};