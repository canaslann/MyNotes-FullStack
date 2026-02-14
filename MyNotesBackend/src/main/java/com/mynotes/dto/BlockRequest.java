package com.mynotes.dto;

import com.mynotes.enums.BlockType;
import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class BlockRequest {

    private BlockType type;
    private String content;
    private String parentId;
    private Map<String, Object> properties;

}