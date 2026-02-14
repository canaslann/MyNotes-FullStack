package com.mynotes.repository;

import com.mynotes.model.User;
import java.util.Optional;

public interface IUserRepository {
    // Email ile kullanıcı bulma (Login için şart)
    Optional<User> findByEmail(String email);

    // Kullanıcı kaydetme (Register için şart)
    User save(User user);
}