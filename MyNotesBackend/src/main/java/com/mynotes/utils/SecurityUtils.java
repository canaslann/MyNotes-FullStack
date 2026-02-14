package com.mynotes.utils;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

public class SecurityUtils {

    // Şu anki login olmuş kullanıcının email'ini al
    public static String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername(); // Email
        }

        return principal.toString();
    }
}