package com.mynotes.model;

import com.mynotes.enums.BlockType;
import lombok.*;

import java.util.Date;
import java.util.Map;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Block {

    private String id;

    private BlockType type; // blok tipi

    private String content;

    private String parentId; // root islemi icin sayfa sayfa icinde

    private Map<String, Object> properties;

    private Date timestamp;

    private String userId;

}
