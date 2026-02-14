package com.mynotes.service.impl;

import com.mynotes.enums.BlockType;
import com.mynotes.exception.RecourceNotFoundException;
import com.mynotes.model.Block;
import com.mynotes.repository.impl.BlockRepository;
import com.mynotes.service.IBlockService;
import com.mynotes.utils.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Service
public class BlockService implements IBlockService {

    @Autowired
    BlockRepository blockRepository;

    public Block createBlock(Block block) {
        // Şu anki kullanıcının email'ini al
        String currentUserEmail = SecurityUtils.getCurrentUserEmail();

        // Block'a userId ekle
        block.setId(UUID.randomUUID().toString());
        block.setTimestamp(new Date());
        block.setUserId(currentUserEmail);  // ← ÖNEMLİ!

        Block savedBlock = blockRepository.save(block);
        return savedBlock;
    }

    public Block getBlock(String id) throws ExecutionException, InterruptedException {
        String currentUserEmail = SecurityUtils.getCurrentUserEmail();

        Optional<Block> optional = blockRepository.findById(id);
        if (optional.isEmpty()) {
            return null;
        }

        Block block = optional.get();

        // Sadece kendi bloklarını görebilir
        if (!block.getUserId().equals(currentUserEmail)) {
            throw new RecourceNotFoundException("Block not found or access denied");
        }

        return block;
    }

    public List<Block> getPageContent(String pageId) throws ExecutionException, InterruptedException {
        String currentUserEmail = SecurityUtils.getCurrentUserEmail();

        // Sadece kendi bloklarını getir
        return blockRepository.findAllByParentIdAndUserId(pageId, currentUserEmail);
    }

    public List<Block> getRootPages() throws ExecutionException, InterruptedException {
        String currentUserEmail = SecurityUtils.getCurrentUserEmail();

        // Sadece kendi root sayfalarını getir
        return blockRepository.findAllByParentIdAndUserId("root", currentUserEmail);
    }

    @Override
    public void deleteBlock(String id) throws ExecutionException, InterruptedException {
        String currentUserEmail = SecurityUtils.getCurrentUserEmail();

        Optional<Block> optional = blockRepository.findById(id);
        if (optional.isEmpty()) {
            throw new RecourceNotFoundException("Block not found");
        }

        Block block = optional.get();

        if (!block.getUserId().equals(currentUserEmail)) {
            throw new RecourceNotFoundException("Block not found or access denied");
        }

        // Eğer bu bir sayfa ise, içindeki tüm blokları da sil
        if (block.getType() == BlockType.PAGE) {
            deleteBlocksRecursively(id, currentUserEmail);
        }

        blockRepository.deleteById(id);
    }

    private void deleteBlocksRecursively(String parentId, String userId) throws ExecutionException, InterruptedException {
        // Bu parent'a ait tüm child blokları bul
        List<Block> childBlocks = blockRepository.findAllByParentIdAndUserId(parentId, userId);

        // Her child'ı recursive olarak sil
        for (Block child : childBlocks) {
            if (child.getType() == BlockType.PAGE) {
                deleteBlocksRecursively(child.getId(), userId);
            }
            blockRepository.deleteById(child.getId());
        }
    }

    @Override
    public Block updateBlock(String id, Block blockRequest) {
        String currentUserEmail = SecurityUtils.getCurrentUserEmail();

        Block existingBlock = blockRepository.findById(id)
                .orElseThrow(() -> new RecourceNotFoundException("Block not found: " + id));

        // Sadece kendi bloğunu güncelleyebilir
        if (!existingBlock.getUserId().equals(currentUserEmail)) {
            throw new RecourceNotFoundException("Block not found or access denied");
        }

        if (blockRequest.getContent() != null) {
            existingBlock.setContent(blockRequest.getContent());
        }

        if (blockRequest.getType() != null) {
            existingBlock.setType(blockRequest.getType());
        }

        if (blockRequest.getProperties() != null) {
            existingBlock.setProperties(blockRequest.getProperties());
        }

        return blockRepository.save(existingBlock);
    }

    @Override
    public Block moveBlock(String id, String newParentId) {
        String currentUserEmail = SecurityUtils.getCurrentUserEmail();

        Block existingBlock = blockRepository.findById(id)
                .orElseThrow(() -> new RecourceNotFoundException("Block not found: " + id));

        // Sadece kendi bloğunu taşıyabilir
        if (!existingBlock.getUserId().equals(currentUserEmail)) {
            throw new RecourceNotFoundException("Block not found or access denied");
        }

        existingBlock.setParentId(newParentId);
        return blockRepository.save(existingBlock);
    }
}