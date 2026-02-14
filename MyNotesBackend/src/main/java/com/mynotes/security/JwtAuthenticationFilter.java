package com.mynotes.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService; // Birazdan tanımlayacağız

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        // 1. Header kontrolü: "Bearer " ile başlıyor mu?
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 2. Token'ı al ("Bearer " kısmını kes)
        jwt = authHeader.substring(7);
        userEmail = jwtUtil.extractUsername(jwt); // Token'dan email'i çöz

        // 3. Email var ama henüz sisteme giriş yapılmamışsa (Context boşsa)
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // Veritabanından kullanıcıyı bul
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

            // 4. Token geçerli mi?
            if (jwtUtil.isTokenValid(jwt, userDetails)) {
                // Spring Security'ye "Bu adam geçerli, içeri al" diyoruz
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        filterChain.doFilter(request, response);
    }
}