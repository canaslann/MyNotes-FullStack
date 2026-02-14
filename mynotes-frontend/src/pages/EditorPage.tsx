import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useBlockStore } from '@/stores/blockStore';
import { Block } from '@/components/Block';
import { FileText } from 'lucide-react';

interface EditorPageProps {
  pageId: string | null;
  onMenuToggle: () => void;
}

export const EditorPage: React.FC<EditorPageProps> = ({ pageId }) => {
  const { blocks, fetchPageContent, rootPages, updateBlock } = useBlockStore();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [pageTitle, setPageTitle] = useState('');

  useEffect(() => {
    if (pageId) {
      fetchPageContent(pageId);
    }
  }, [pageId]);

  const currentPage = rootPages.find((p) => p.id === pageId);

  useEffect(() => {
    if (currentPage) {
      setPageTitle(currentPage.content);
    }
  }, [currentPage]);

  useEffect(() => {
    // Yeni block eklendiğinde en sondaki textarea'ya focus
    if (blocks.length > 0) {
      setTimeout(() => {
        const textareas = document.querySelectorAll('textarea');
        const lastTextarea = textareas[textareas.length - 1];
        if (lastTextarea && document.activeElement !== lastTextarea) {
          lastTextarea.focus();
        }
      }, 100);
    }
  }, [blocks.length]);

  const handleTitleSave = async () => {
    if (!pageId || !pageTitle.trim()) return;
    setIsEditingTitle(false);
    if (pageTitle !== currentPage?.content) {
      await updateBlock(pageId, { content: pageTitle });
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTitleSave();
    } else if (e.key === 'Escape') {
      setPageTitle(currentPage?.content || 'Untitled');
      setIsEditingTitle(false);
    }
  };

  if (!pageId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-light">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <FileText size={64} className="mx-auto mb-4 text-gray-300" />
            <h2 className="text-2xl font-serif text-gray-400 mb-2">
              No page selected
            </h2>
            <p className="text-sm font-mono text-gray-400">
              Select a page from the sidebar or create a new one
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-light overflow-hidden">
      {/* Header */}
      <div className="border-b-4 border-dark bg-white p-6">
        {isEditingTitle ? (
          <input
            type="text"
            value={pageTitle}
            onChange={(e) => setPageTitle(e.target.value)}
            onBlur={handleTitleSave}
            onKeyDown={handleTitleKeyDown}
            autoFocus
            className="text-4xl font-serif font-bold text-dark bg-transparent border-none outline-none w-full focus:border-b-2 focus:border-primary"
          />
        ) : (
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => setIsEditingTitle(true)}
            className="text-4xl font-serif font-bold text-dark cursor-pointer hover:text-primary transition-colors"
          >
            {pageTitle || 'Untitled'}
          </motion.h1>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto">
          {blocks.map((block) => (
            <Block key={block.id} block={block} pageId={pageId} />
          ))}
          
          {/* Empty state */}
          {blocks.length === 0 && (
            <Block key="new" block={null} pageId={pageId} />
          )}
        </div>
      </div>
    </div>
  );
};