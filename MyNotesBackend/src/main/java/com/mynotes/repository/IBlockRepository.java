package com.mynotes.repository;

import com.mynotes.model.Block;

import java.util.List;
import java.util.Optional;

public interface IBlockRepository {
    Block save(Block block);
    Optional<Block> findById(String id);
    List<Block> findAllByParentId(String parentId);
    List<Block> findAllByParentIdAndUserId(String parentId, String userId);
    void deleteById(String id);
}