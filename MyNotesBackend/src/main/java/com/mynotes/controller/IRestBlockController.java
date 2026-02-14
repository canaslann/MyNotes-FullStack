package com.mynotes.controller;

import com.mynotes.dto.BlockRequest;
import com.mynotes.dto.BlockResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.concurrent.ExecutionException;

public interface IRestBlockController {

    // Ekleme (Artık BlockRequest alıyor, BlockResponse dönüyor)
    ResponseEntity<BlockResponse> createBlock(@RequestBody BlockRequest request);

    // ID ile Getir
    ResponseEntity<BlockResponse> getBlock(@PathVariable String id) throws ExecutionException, InterruptedException;

    // Sayfa İçeriğini Getir
    ResponseEntity<List<BlockResponse>> getPageContent(@PathVariable String pageId) throws ExecutionException, InterruptedException;

    // Ana Sayfaları Getir
    ResponseEntity<List<BlockResponse>> getRootPages() throws ExecutionException, InterruptedException;

    // Silme (Void dönüş tipi)
    ResponseEntity<Void> deleteBlock(@PathVariable String id) throws ExecutionException, InterruptedException;

    // Güncelleme (Request alıyor, Response dönüyor)
    ResponseEntity<BlockResponse> updateBlock(@PathVariable String id, @RequestBody BlockRequest blockRequest);

    // Taşıma (Parametreler düzeltildi)
    ResponseEntity<BlockResponse> moveBlock(@PathVariable String id, @RequestParam String newParentId);
}
