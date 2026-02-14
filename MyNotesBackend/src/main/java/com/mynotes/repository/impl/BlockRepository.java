package com.mynotes.repository.impl;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import com.mynotes.exception.RecourceNotFoundException;
import com.mynotes.model.Block;
import com.mynotes.repository.IBlockRepository;
import org.springframework.stereotype.Repository;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

@Repository
public class BlockRepository implements IBlockRepository {

    private static final String COLLECTION_NAME = "blocks";

    @Override
    public Optional<Block> findById(String id) {
        Firestore db = FirestoreClient.getFirestore();
        try {
            DocumentSnapshot doc = db.collection(COLLECTION_NAME).document(id).get().get();
            if (doc.exists()) {
                return Optional.ofNullable(doc.toObject(Block.class));
            }
        } catch (InterruptedException | ExecutionException e) {
            throw new RecourceNotFoundException("Block not found: " + e.getMessage());
        }
        return Optional.empty();
    }

    @Override
    public List<Block> findAllByParentId(String parentId) {
        Firestore db = FirestoreClient.getFirestore();
        List<Block> blocks = new ArrayList<>();

        try {
            Query query = db.collection(COLLECTION_NAME)
                    .whereEqualTo("parentId", parentId)
                    .orderBy("timestamp");

            ApiFuture<QuerySnapshot> future = query.get();
            List<QueryDocumentSnapshot> documents = future.get().getDocuments();

            for (DocumentSnapshot doc : documents) {
                blocks.add(doc.toObject(Block.class));
            }
        } catch (InterruptedException | ExecutionException e) {
            throw new RecourceNotFoundException("Block not found: " + e.getMessage());
        }
        return blocks;
    }

    // YENİ METOD - userId ile filtreli sorgu
    @Override
    public List<Block> findAllByParentIdAndUserId(String parentId, String userId) {
        Firestore db = FirestoreClient.getFirestore();
        List<Block> blocks = new ArrayList<>();

        try {
            Query query = db.collection(COLLECTION_NAME)
                    .whereEqualTo("parentId", parentId)
                    .whereEqualTo("userId", userId)  // ← Kullanıcı filtresi
                    .orderBy("timestamp");

            ApiFuture<QuerySnapshot> future = query.get();
            List<QueryDocumentSnapshot> documents = future.get().getDocuments();

            for (DocumentSnapshot doc : documents) {
                blocks.add(doc.toObject(Block.class));
            }
        } catch (InterruptedException | ExecutionException e) {
            throw new RecourceNotFoundException("Blocks not found: " + e.getMessage());
        }
        return blocks;
    }

    @Override
    public void deleteById(String id) {
        Firestore db = FirestoreClient.getFirestore();
        db.collection(COLLECTION_NAME).document(id).delete();
    }

    @Override
    public Block save(Block block) {
        Firestore db = FirestoreClient.getFirestore();

        if (block.getId() == null || block.getId().isEmpty()) {
            DocumentReference ref = db.collection(COLLECTION_NAME).document();
            block.setId(ref.getId());
        }

        db.collection(COLLECTION_NAME).document(block.getId()).set(block);
        return block;
    }
}