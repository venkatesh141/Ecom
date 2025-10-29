package Ecommerce.Ecommerce.security;


import Ecommerce.Ecommerce.entity.User;
import lombok.Builder;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Data
@Builder
public class AuthUser implements UserDetails {

    private User user;
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(user.getRole().name()));
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
/*
Class Declaration
java
@Data
@Builder
public class AuthUser implements UserDetails {
@Data: Removes boilerplate by providing getters, setters, equals, etc.

@Builder: Lets you construct this object easily with a builder.

implements UserDetails: Makes this class usable by Spring Security, because UserDetails is the interface Spring needs for authentication.

Fields
java
private User user;
Wraps your own User entity inside this AuthUser.

Instead of extending the entity, you just store it here and expose its info to Spring Security.

Methods from UserDetails
java
@Override
public Collection<? extends GrantedAuthority> getAuthorities() {
    return List.of(new SimpleGrantedAuthority(user.getRole().name()));
}
Returns the roles/authorities of the user.

It takes your user.getRole() (probably an Enum) and puts it into Spring’s required GrantedAuthority format.

Example: If role = ADMIN, this returns a list containing "ADMIN".

java
@Override
public String getPassword() {
    return user.getPassword();
}
Provides Spring Security with the user’s password (encrypted).

java
@Override
public String getUsername() {
    return user.getEmail();
}
Defines what Spring should consider as the username for login.

Here, you’re using email instead of an explicit username.

java
@Override
public boolean isAccountNonExpired() {
    return true;
}
Always returns true, meaning account never expires.

java
@Override
public boolean isAccountNonLocked() {
    return true;
}
Always returns true, meaning account is never locked.

java
@Override
public boolean isCredentialsNonExpired() {
    return true;
}
Always true, meaning password never expires.

java
@Override
public boolean isEnabled() {
    return true;
}
Always true, meaning the user is active.

You could link this to a column like user.isActive() if you want to manage disabled users.

In Simple Words
This class adapts your User entity so Spring Security can use it for login.

It tells Spring Security:

What the username is (here, email).

What the password is.

What the roles/authorities are.

Whether the account is active, non-expired, non-locked, etc. (all set to true here).

Would you like me to also draw a diagram of how this AuthUser fits into Spring Security’s authentication process (from login request → to checking roles)?

 */
