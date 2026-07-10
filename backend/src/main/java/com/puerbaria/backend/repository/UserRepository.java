package com.puerbaria.backend.repository;

import com.puerbaria.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    
    // Método para buscar un usuario por su email (clave para el login)
    Optional<User> findByEmail(String email);

}
