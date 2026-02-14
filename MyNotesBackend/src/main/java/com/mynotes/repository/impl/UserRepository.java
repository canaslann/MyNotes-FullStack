package com.mynotes.repository.impl;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import com.mynotes.model.User;
import com.mynotes.repository.IUserRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

@Repository
public class UserRepository implements IUserRepository {

    private static final String COLLECTION_NAME = "users"; // Firebase'de oluşacak koleksiyon adı

    @Override
    public Optional<User> findByEmail(String email) {
        Firestore db = FirestoreClient.getFirestore();
        try {
            // SQL Karşılığı: SELECT * FROM users WHERE email = '...'
            Query query = db.collection(COLLECTION_NAME).whereEqualTo("email", email);

            // Sorguyu çalıştır
            ApiFuture<QuerySnapshot> querySnapshot = query.get();
            List<QueryDocumentSnapshot> documents = querySnapshot.get().getDocuments();

            if (!documents.isEmpty()) {
                // İlk bulunan kullanıcıyı User nesnesine çevirip döndür
                return Optional.of(documents.get(0).toObject(User.class));
            }
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
        }
        return Optional.empty();
    }

    @Override
    public User save(User user) {
        Firestore db = FirestoreClient.getFirestore();

        // Eğer ID yoksa yeni bir ID oluştur (Yeni Kayıt)
        if (user.getId() == null || user.getId().isEmpty()) {
            DocumentReference ref = db.collection(COLLECTION_NAME).document();
            user.setId(ref.getId());
        }

        // Veriyi Firestore'a yaz/güncelle
        db.collection(COLLECTION_NAME).document(user.getId()).set(user);

        return user;
    }
}