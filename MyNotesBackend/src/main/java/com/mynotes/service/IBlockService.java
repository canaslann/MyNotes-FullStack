package com.mynotes.service;

import com.mynotes.model.Block;

import java.util.List;
import java.util.concurrent.ExecutionException;

public interface IBlockService {
    public Block getBlock(String id) throws ExecutionException, InterruptedException;

    public Block createBlock(Block block);

    public List<Block> getPageContent(String pageId) throws ExecutionException, InterruptedException;

    public List<Block> getRootPages() throws ExecutionException, InterruptedException;

    public void deleteBlock(String id) throws ExecutionException, InterruptedException;

    Block updateBlock(String id, Block blockRequest);

    Block moveBlock(String id, String newParentId);
}
