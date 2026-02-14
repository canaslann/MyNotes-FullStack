package com.mynotes.dto;

import com.mynotes.enums.BlockType;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
@Builder
public class BlockResponse { // Cevap DTO

    private String id;

    private BlockType type;

    private String content;

    private String parentId;

    private Map<String, Object> properties;

    private Long timestamp;

    private String userId;

}
