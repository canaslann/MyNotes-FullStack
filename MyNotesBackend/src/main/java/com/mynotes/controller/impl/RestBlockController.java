package com.mynotes.controller.impl;

import com.mynotes.controller.IRestBlockController;
import com.mynotes.dto.BlockRequest;
import com.mynotes.dto.BlockResponse;
import com.mynotes.mapper.BlockMapper;
import com.mynotes.model.Block;
import com.mynotes.service.IBlockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/blocks")
public class RestBlockController implements IRestBlockController {

    @Autowired
    private IBlockService blockService;
    @Autowired
    private BlockMapper blockMapper;

    @PostMapping("/add-block")
    public ResponseEntity<BlockResponse> createBlock(@RequestBody BlockRequest request) {
        // 1. Request -> Entity
        Block block = blockMapper.toEntity(request);

        // 2. Service işlemini yap
        Block savedBlock = blockService.createBlock(block);

        // 3. Entity -> Response
        return ResponseEntity.ok(blockMapper.toResponse(savedBlock));
    }

    @GetMapping("/getBlockById/{id}")
    public ResponseEntity<BlockResponse> getBlock(@PathVariable String id) throws ExecutionException, InterruptedException {
        Block block = blockService.getBlock(id);
        return ResponseEntity.ok(blockMapper.toResponse(block));
    }

    @GetMapping("/content/{pageId}")
    public ResponseEntity<List<BlockResponse>> getPageContent(@PathVariable String pageId) throws ExecutionException, InterruptedException {
        List<Block> blocks = blockService.getPageContent(pageId);

        // Listeyi tek tek dönüştür (Stream API)
        List<BlockResponse> responseList = blocks.stream()
                .map(blockMapper::toResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responseList);
    }

    @GetMapping("/getRoots")
    public ResponseEntity<List<BlockResponse>> getRootPages() throws ExecutionException, InterruptedException {
        // 1. Service'den ham entity listesini al
        List<Block> rootBlocks = blockService.getRootPages();

        // 2. Her bir Block'u BlockResponse'a çevir (Mapping)
        List<BlockResponse> responseList = rootBlocks.stream()
                .map(blockMapper::toResponse) // Metod referansı
                .toList(); // Java 16+ (Eskisi ise .collect(Collectors.toList()))

        // 3. DTO listesini döndür
        return ResponseEntity.ok(responseList);
    }

    @DeleteMapping("/deleteBlock/{id}")
    public ResponseEntity<Void> deleteBlock(@PathVariable String id) throws ExecutionException, InterruptedException {
        blockService.deleteBlock(id);
        // İşlem başarılıysa ve içerik dönmüyorsa 200 OK dönebiliriz
        return ResponseEntity.ok().build();
    }

    @PutMapping("/updateBlock/{id}")
    @Override
    public ResponseEntity<BlockResponse> updateBlock(@PathVariable String id, @RequestBody BlockRequest blockRequest) {

        Block requestEntity = blockMapper.toEntity(blockRequest);

        Block updatedBlock = blockService.updateBlock(id, requestEntity);

        // 3. Entity -> Response DTO Dönüşümü
        return ResponseEntity.ok(blockMapper.toResponse(updatedBlock));
    }

    @PatchMapping("/moveBlock/{id}")
    @Override
    public ResponseEntity<BlockResponse> moveBlock(@PathVariable String id, @RequestParam String newParentId) {
        // 1. Service işlemini yap (Zaten String alıp Block dönüyor)
        Block movedBlock = blockService.moveBlock(id, newParentId);

        // 2. Entity -> Response DTO Dönüşümü
        return ResponseEntity.ok(blockMapper.toResponse(movedBlock));
    }

}
