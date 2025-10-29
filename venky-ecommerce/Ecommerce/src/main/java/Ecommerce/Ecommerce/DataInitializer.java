package Ecommerce.Ecommerce;

import Ecommerce.Ecommerce.entity.User;
import Ecommerce.Ecommerce.enums.UserRole;
import Ecommerce.Ecommerce.repository.UserRepo;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;


import org.springframework.security.crypto.password.PasswordEncoder;


@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepo rep;
    private final PasswordEncoder encoder; // Use interface

    // Constructor injection - Spring will provide beans automatically
    public DataInitializer(UserRepo rep, PasswordEncoder encoder) {
        this.rep = rep;
        this.encoder = encoder;
    }

    @Override
    public void run(String... args) {
        if (rep.findByEmail("v5@gmail.com") == null) { // or .isEmpty() if repo returns Optional
            User admin = User.builder()
                    .name("venky_venky")
                    .email("v5@gmail.com")
                    .password(encoder.encode("12345")) // use injected encoder
                    .phoneNumber("9080123987")
                    .role(UserRole.ADMIN)
                    .build();
            rep.save(admin);
            System.out.println("Admin user created!");
        }
    }
}
