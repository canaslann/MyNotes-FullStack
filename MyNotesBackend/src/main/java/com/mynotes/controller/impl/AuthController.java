package com.mynotes.controller.impl;

import com.mynotes.dto.AuthRequest;
import com.mynotes.dto.AuthResponse;
import com.mynotes.model.User;
import com.mynotes.repository.IUserRepository;
import com.mynotes.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final IUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    // KAYIT OL (Register)
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody AuthRequest request) {
        // 1. Yeni User nesnesi oluştur
        var user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword())) // Şifreyi şifrele!
                .role("USER")
                .build();

        // 2. Firebase'e kaydet
        userRepository.save(user); // UserRepositoryImpl içindeki save metodunu kullanır

        // 3. Token üret ve dön
        // Geçici bir UserDetails oluşturup token basıyoruz
        var userDetails = new org.springframework.security.core.userdetails.User(
                user.getEmail(), user.getPassword(), java.util.Collections.emptyList());

        var token = jwtUtil.generateToken(userDetails);

        return ResponseEntity.ok(AuthResponse.builder().token(token).build());
    }

    // GİRİŞ YAP (Login)
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        // 1. Spring Security ile kimlik doğrulama yap (Hata varsa exception fırlatır)
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        // 2. Doğrulama başarılıysa, kullanıcı detaylarını bul (Token üretmek için)
        // Burada basitçe tekrar UserDetails oluşturabiliriz veya DB'den çekebiliriz.
        // Hızlı çözüm için DB'den çekelim:
        var user = userRepository.findByEmail(request.getEmail()).orElseThrow();

        var userDetails = new org.springframework.security.core.userdetails.User(
                user.getEmail(), user.getPassword(), java.util.Collections.emptyList());

        // 3. Token üret
        var token = jwtUtil.generateToken(userDetails);

        return ResponseEntity.ok(AuthResponse.builder().token(token).build());
    }
}