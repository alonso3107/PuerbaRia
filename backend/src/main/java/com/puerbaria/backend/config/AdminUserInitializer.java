package com.puerbaria.backend.config;

import com.puerbaria.backend.model.Role;
import com.puerbaria.backend.model.User;
import com.puerbaria.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminUserInitializer implements ApplicationRunner {

    @Value("${admin_email}")
    private String adminEmail;

    @Value("${admin_password}")
    private String adminPassword;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) {
        userRepository.findByEmail(adminEmail).ifPresentOrElse(this::asegurarRolAdmin, this::crearAdmin);
    }

    private void asegurarRolAdmin(User usuario) {
        if (usuario.getRole() != Role.ADMIN) {
            usuario.setRole(Role.ADMIN);
            usuario.setPassword(passwordEncoder.encode(adminPassword));
            userRepository.save(usuario);
        }
    }

    private void crearAdmin() {
        User admin = User.builder()
                .name("Administrador")
                .email(adminEmail)
                .password(passwordEncoder.encode(adminPassword))
                .role(Role.ADMIN)
                .build();

        userRepository.save(admin);
    }
}
