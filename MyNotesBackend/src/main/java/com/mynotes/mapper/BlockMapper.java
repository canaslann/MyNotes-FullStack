package com.mynotes.mapper;

import com.mynotes.dto.BlockRequest;
import com.mynotes.dto.BlockResponse;
import com.mynotes.model.Block;
import org.springframework.stereotype.Component;

@Component
public class BlockMapper {

    public Block toEntity(BlockRequest request) {
        return Block.builder()
                .type(request.getType())
                .content(request.getContent())
                .parentId(request.getParentId())
                .properties(request.getProperties())
                // userId Service'de eklenecek
                .build();
    }

    public BlockResponse toResponse(Block block) {
        return BlockResponse.builder()
                .id(block.getId())
                .type(block.getType())
                .content(block.getContent())
                .parentId(block.getParentId())
                .properties(block.getProperties())
                .timestamp(block.getTimestamp().getTime())
                .userId(block.getUserId())  // ← Frontend'e gönder
                .build();
    }
}