import { create } from 'zustand';
import { BlockState, BlockRequest } from '@/types';
import { blockService } from '@/services/blockService';

export const useBlockStore = create<BlockState>((set) => ({
  blocks: [],
  currentPage: null,
  rootPages: [],
  loading: false,
  error: null,

  fetchRootPages: async () => {
    set({ loading: true, error: null });
    try {
      const pages = await blockService.getRootPages();
      set({ rootPages: pages, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchPageContent: async (pageId: string) => {
    set({ loading: true, error: null, currentPage: pageId });
    try {
      const blocks = await blockService.getPageContent(pageId);
      set({ blocks, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  createBlock: async (blockRequest: BlockRequest) => {
    set({ loading: true, error: null });
    try {
      const newBlock = await blockService.createBlock(blockRequest);
      
      // Root page ise rootPages'e ekle
      if (blockRequest.parentId === 'root') {
        set((state) => ({
          rootPages: [...state.rootPages, newBlock],
          loading: false,
        }));
      } else {
        // Normal block ise mevcut blocks'a ekle
        set((state) => ({
          blocks: [...state.blocks, newBlock],
          loading: false,
        }));
      }
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  updateBlock: async (id: string, blockRequest: Partial<BlockRequest>) => {
    set({ loading: true, error: null });
    try {
      const updatedBlock = await blockService.updateBlock(id, blockRequest);
      
      set((state) => ({
        blocks: state.blocks.map((block) =>
          block.id === id ? updatedBlock : block
        ),
        rootPages: state.rootPages.map((page) =>
          page.id === id ? updatedBlock : page
        ),
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  deleteBlock: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await blockService.deleteBlock(id);
      
      set((state) => ({
        blocks: state.blocks.filter((block) => block.id !== id),
        rootPages: state.rootPages.filter((page) => page.id !== id),
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  moveBlock: async (id: string, newParentId: string) => {
    set({ loading: true, error: null });
    try {
      const movedBlock = await blockService.moveBlock(id, newParentId);
      
      set((state) => ({
        blocks: state.blocks.map((block) =>
          block.id === id ? movedBlock : block
        ),
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));
