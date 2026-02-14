package com.mynotes.service.impl;

import com.mynotes.model.User;
import com.mynotes.repository.IUserRepository;
import com.mynotes.repository.impl.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service; // 👈 EN ÖNEMLİSİ BU!
import java.util.Collections;

@Service // 👈 BU ANOTASYON YOKSA SPRING BU SINIFI GÖRMEZ!
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // 1. Kendi repomuzdan kullanıcıyı bul
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Kullanıcı bulunamadı: " + email));

        // 2. Spring Security'nin anladığı User objesine çevir
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole()))
        );
    }
}