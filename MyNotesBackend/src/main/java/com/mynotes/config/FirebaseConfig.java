package com.mynotes.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;

@Configuration
public class FirebaseConfig {

    @Bean
    public FirebaseApp initializeFirebase() throws IOException {
        InputStream serviceAccount;

        // Railway'de environment variable'dan oku
        String firebaseConfig = System.getenv("FIREBASE_CONFIG");

        if (firebaseConfig != null) {
            // Railway: JSON string'i stream'e çevir
            serviceAccount = new ByteArrayInputStream(firebaseConfig.getBytes());
        } else {
            // Local: Classpath'ten oku
            throw new RuntimeException("FIREBASE_CONFIG environment variable not set");
        }

        FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .build();

        if (FirebaseApp.getApps().isEmpty()) {
            return FirebaseApp.initializeApp(options);
        }
        return FirebaseApp.getInstance();
    }
}