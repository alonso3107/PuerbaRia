package com.puerbaria.backend.backend.config;

import com.puerbaria.backend.backend.model.Role;
import com.puerbaria.backend.backend.model.User;
import com.puerbaria.backend.backend.repository.UserRepository;
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
    private String ADMIN_EMAIL;

    @Value("${admin_password}")
    private String ADMIN_PASSWORD;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) {
        var existingAdmin = userRepository.findByEmail(ADMIN_EMAIL);
        if (existingAdmin.isPresent()) {
            User admin = existingAdmin.get();
            if (admin.getRole() != Role.ADMIN) {
                admin.setRole(Role.ADMIN);
                admin.setPassword(passwordEncoder.encode(ADMIN_PASSWORD));
                userRepository.save(admin);
            }
            return;
        }

        User admin = User.builder()
                .name("Administrador")
                .email(ADMIN_EMAIL)
                .password(passwordEncoder.encode(ADMIN_PASSWORD))
                .role(Role.ADMIN)
                .build();

        userRepository.save(admin);
    }
}
