package com.mynotes.dto;
import lombok.Data;

@Data
public class AuthRequest {
    private String email;
    private String password;
    private String username; // Sadece Register'da lazım olur
}