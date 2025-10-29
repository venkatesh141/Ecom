package Ecommerce.Ecommerce.security;


import Ecommerce.Ecommerce.entity.User;
import Ecommerce.Ecommerce.exception.NotFoundException;
import Ecommerce.Ecommerce.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepo userRepo;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        User user = userRepo.findByEmail(username)
                .orElseThrow(()-> new NotFoundException("User/ Email Not found"));

        return AuthUser.builder()
                .user(user)
                .build();
    }
}
/*
@Service → Marks this class as a Spring service (a class that contains business logic and can be managed by Spring).

@RequiredArgsConstructor → Automatically creates a constructor that takes all final fields as arguments.
👉 Here, it means Spring will inject UserRepo automatically into this class.

public class CustomUserDetailsService implements UserDetailsService {

This class is named CustomUserDetailsService.

It implements UserDetailsService → an interface from Spring Security.

Purpose of UserDetailsService → To load user details (like username, password, roles) from the database when someone tries to log in.


    private final UserRepo userRepo;
This is the UserRepo (a repository to interact with the database).

final → means this field must be initialized (which is done automatically by @RequiredArgsConstructor).

@Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
This method is required because we are implementing UserDetailsService.

Spring Security will call this method when a user tries to log in.

It gives us the username (here, we are treating it as an email).

If user is not found, we should throw UsernameNotFoundException.

java
Copy code
        User user = userRepo.findByEmail(username)
                .orElseThrow(()-> new NotFoundException("User/ Email Not found"));
userRepo.findByEmail(username) → Looks for a user in the database by email (since username = email here).

.orElseThrow(...) → If no user is found, it throws a custom exception NotFoundException("User/ Email Not found").

If user is found → we store it in user.

java
Copy code
        return AuthUser.builder()
                .user(user)
                .build();
AuthUser is a class (probably implements UserDetails).

.builder() → is a builder pattern to create an AuthUser object.

.user(user) → we set the database User into AuthUser.

.build() → finally builds the AuthUser object.

We return this AuthUser → Spring Security will use it for authentication (checking password, roles, etc.).

✅ In short:
This class tells Spring Security how to fetch user details from the database using email. If the user exists, we return an AuthUser object; if not, we throw an error.


 */