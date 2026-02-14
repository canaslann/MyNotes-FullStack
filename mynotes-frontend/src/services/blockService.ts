import apiClient from '@/utils/apiClient';
import { Block, BlockRequest, BlockResponse } from '@/types';

export const blockService = {
  async getRootPages(): Promise<Block[]> {
    const response = await apiClient.get<BlockResponse[]>('/blocks/getRoots');
    return response.data;
  },

  async getPageContent(pageId: string): Promise<Block[]> {
    const response = await apiClient.get<BlockResponse[]>(`/blocks/content/${pageId}`);
    return response.data;
  },

  async getBlock(id: string): Promise<Block> {
    const response = await apiClient.get<BlockResponse>(`/blocks/getBlockById/${id}`);
    return response.data;
  },

  async createBlock(block: BlockRequest): Promise<Block> {
    const response = await apiClient.post<BlockResponse>('/blocks/add-block', block);
    return response.data;
  },

  async updateBlock(id: string, block: Partial<BlockRequest>): Promise<Block> {
    const response = await apiClient.put<BlockResponse>(`/blocks/updateBlock/${id}`, block);
    return response.data;
  },

  async deleteBlock(id: string): Promise<void> {
    await apiClient.delete(`/blocks/deleteBlock/${id}`);
  },

  async moveBlock(id: string, newParentId: string): Promise<Block> {
    const response = await apiClient.patch<BlockResponse>(
      `/blocks/moveBlock/${id}`,
      null,
      { params: { newParentId } }
    );
    return response.data;
  },
};
