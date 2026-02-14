import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useBlockStore } from '@/stores/blockStore';
import { useAuthStore } from '@/stores/authStore';
import { 
  FileText, 
  Plus, 
  LogOut, 
  User,
  Trash2
} from 'lucide-react';
import { BlockType } from '@/types';

interface SidebarProps {
  onPageSelect: (pageId: string) => void;
  currentPageId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  onPageSelect, 
  currentPageId
}) => {
  const { rootPages, fetchRootPages, createBlock, deleteBlock } = useBlockStore();
  const { logout, user } = useAuthStore();
  const [deletingPageId, setDeletingPageId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>(''); 

  useEffect(() => {
    // LocalStorage'dan email al
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setUserEmail(storedEmail);
    } else if (user?.email) {
      setUserEmail(user.email);
      localStorage.setItem('userEmail', user.email);
    }
  }, [user]);

  useEffect(() => {
    fetchRootPages();
  }, []);

  const handleCreatePage = async () => {
    await createBlock({
      type: BlockType.PAGE,
      content: 'Untitled',
      parentId: 'root',
      properties: {},
    });
  };

  const handleDeletePage = async (pageId: string, pageName: string) => {
    const confirmed = window.confirm(
      `"${pageName}" sayfasını silmek istediğinize emin misiniz?\n\nBu işlem geri alınamaz!`
    );
    
    if (!confirmed) return;

    setDeletingPageId(pageId);
    
    try {
      await deleteBlock(pageId);
      
      // Eğer silinen sayfa şu an açıksa, hiçbir sayfa seçili olmasın
      if (currentPageId === pageId) {
        onPageSelect('');
      }
    } catch (error) {
      console.error('Sayfa silinirken hata:', error);
      alert('Sayfa silinemedi. Lütfen tekrar deneyin.');
    } finally {
      setDeletingPageId(null);
    }
  };

  return (
    <aside className="h-screen w-80 bg-light border-r-4 border-dark flex flex-col">
      {/* Header */}
      <div className="p-6 border-b-4 border-dark bg-primary">
        <div className="mb-4">
          <h1 className="text-3xl font-serif font-bold text-dark">MyNotes</h1>
        </div>
        <div className="flex items-center gap-2 text-dark font-mono text-sm">
          <User size={14} />
          <span className="truncate">{userEmail || user?.email || 'User'}</span>
        </div>
      </div>

      {/* New Page Button */}
      <div className="p-4 border-b-2 border-dark">
        <button
          onClick={handleCreatePage}
          className="w-full flex items-center gap-2 bg-dark text-light font-mono font-bold py-3 px-4 
                   hover:bg-primary hover:text-dark transition-all duration-200 
                   border-2 border-dark shadow-[2px_2px_0px_0px_rgba(125,73,222,1)]"
        >
          <Plus size={18} />
          <span>NEW PAGE</span>
        </button>
      </div>

      {/* Pages List */}
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="text-xs font-mono font-bold text-gray-500 mb-3">PAGES</h3>
        
        {rootPages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm font-mono text-gray-400">No pages yet</p>
            <p className="text-xs font-mono text-gray-400 mt-1">
              Create your first page!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {rootPages.map((page) => (
              <motion.div
                key={page.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="group relative"
              >
                <button
                  onClick={() => onPageSelect(page.id)}
                  disabled={deletingPageId === page.id}
                  className={`w-full flex items-center gap-3 p-3 rounded font-mono text-sm text-left
                           transition-all duration-200 border-2 
                           ${deletingPageId === page.id ? 'opacity-50 cursor-not-allowed' : ''}
                           ${
                             currentPageId === page.id
                               ? 'bg-primary border-dark text-dark shadow-[2px_2px_0px_0px_rgba(10,10,10,1)]'
                               : 'border-transparent hover:bg-gray-100'
                           }`}
                >
                  <FileText size={16} />
                  <span className="flex-1 truncate">{page.content}</span>
                </button>

                {/* Delete Button - Hover'da Görünür */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeletePage(page.id, page.content);
                  }}
                  disabled={deletingPageId === page.id}
                  className="absolute right-2 top-1/2 -translate-y-1/2
                           opacity-0 group-hover:opacity-100 transition-opacity
                           p-2 hover:bg-purple-100 rounded disabled:cursor-not-allowed"
                  title="Sayfayı sil"
                >
                  <Trash2 size={14} className="text-purple-600" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t-2 border-dark">
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 bg-red-50 text-purple-600 font-mono font-bold py-3 px-4 
                   hover:bg-purple-100 transition-colors border-2 border-purple-600"
        >
          <LogOut size={18} />
          <span>LOGOUT</span>
        </button>
      </div>
    </aside>
  );
};