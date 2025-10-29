package Ecommerce.Ecommerce.security;

import Ecommerce.Ecommerce.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.function.Function;

@Service
@Slf4j
public class JwtUtils {


    private static final long EXPIRATION_TIME_IN_MILLISEC = 1000L * 60L *60L *24L * 30L * 6L; //expirers 6 months
    private SecretKey key;

    @Value("${secreteJwtString}")
    private String secreteJwtString; //Make sure the value in the application properties is 32characters or long

    @PostConstruct
    private void init(){
        byte[] keyBytes = secreteJwtString.getBytes(StandardCharsets.UTF_8);
        this.key = new SecretKeySpec(keyBytes, "HmacSHA256");
    }

    public String generateToken(User user){
        String username = user.getEmail();
        return generateToken(username);
    }

    public String generateToken(String username){
        return Jwts.builder()
                .subject(username)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME_IN_MILLISEC))
                .signWith(key)
                .compact();
    }

    public String getUsernameFromToken(String token){
        return extractClaims(token, Claims::getSubject);
    }

    private <T> T extractClaims(String token, Function<Claims, T> claimsTFunction){
        return claimsTFunction.apply(Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload());
    }

    public boolean isTokenValid(String token, UserDetails userDetails){
        final String username = getUsernameFromToken(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token){
        return extractClaims(token, Claims::getExpiration).before(new Date());
    }


}
/*
What is this class doing?

This JwtUtils class is like a token manager.

It creates tokens when a user logs in.

It reads tokens to know who the user is.

It checks tokens to see if they are valid or expired.


Class and Annotations
java
@Service
@Slf4j
public class JwtUtils {
@Service: Marks this class as a Spring service bean, meaning Spring will manage it and you can use it in other parts of your project.

@Slf4j: Provides a log object you can use for logging messages.

public class JwtUtils: This is the class definition where all JWT-related code lives.

Expiration Time
java
private static final long EXPIRATION_TIME_IN_MILLISEC = 1000L * 60L *60L *24L * 30L * 6L; //expirers 6 months
Here, the constant defines how long the token is valid.

1000L milliseconds = 1 second.

60L * 60L = 3600 seconds = 1 hour.

* 24L = 24 hours = 1 day.

* 30L = 30 days = ~1 month.

* 6L = 6 months.
So, tokens expire after 6 months.

Key Storage
java
private SecretKey key;
This will store the secret key used to sign and verify the JWT.

Secret Key from Properties
java
@Value("${secreteJwtString}")
private String secreteJwtString; //Make sure the value in the application properties is 32characters or long
Reads a string from application.properties (or application.yml) under the key secreteJwtString.

This string is your secret, used to create a signing key.

The note reminds you: The string should be at least 32 characters for security.

Initializing the Key
java
@PostConstruct
private void init(){
    byte[] keyBytes = secreteJwtString.getBytes(StandardCharsets.UTF_8);
    this.key = new SecretKeySpec(keyBytes, "HmacSHA256");
}
@PostConstruct means this method runs right after the class is created by Spring.

It takes the secret string (secreteJwtString), converts it to bytes.

Creates a cryptographic key (SecretKeySpec) using HmacSHA256 algorithm.

Stores it in the key field for later use.

Generate Token from User
java
public String generateToken(User user){
    String username = user.getEmail();
    return generateToken(username);
}
Takes a User object.

Extracts the user’s email (which will be the token’s subject).

Calls another method to generate the token.

Generate Token from Username
java
public String generateToken(String username){
    return Jwts.builder()
            .subject(username)
            .issuedAt(new Date(System.currentTimeMillis()))
            .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME_IN_MILLISEC))
            .signWith(key)
            .compact();
}
Uses the Jwts library to build a JWT.

.subject(username) → sets the token’s subject (who the token is about).

.issuedAt(...) → records when the token was created.

.expiration(...) → sets when the token will expire.

.signWith(key) → signs the token with your secret key to make it tamper-proof.

.compact() → generates the final token string.

Extract Username from Token
java
public String getUsernameFromToken(String token){
    return extractClaims(token, Claims::getSubject);
}
Reads a JWT and returns the subject (which is the username/email you stored).

Extract Claims from Token
java
private <T> T extractClaims(String token, Function<Claims, T> claimsTFunction){
    return claimsTFunction.apply(
        Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload()
    );
}
Claims = data inside the JWT (like username, expiration, etc.).

This method allows you to extract any specific claim.

First, it parses the token using your secret key.

Then it gets the payload (all the claims).

Finally, it applies the function you passed (like getSubject or getExpiration).

Validate Token
java
public boolean isTokenValid(String token, UserDetails userDetails){
    final String username = getUsernameFromToken(token);
    return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
}
Gets the username from the token.

Checks if it matches the username of the given UserDetails.

Also checks the token isn’t expired.

Returns true if both conditions are met.

Check if Token is Expired
java
private boolean isTokenExpired(String token){
    return extractClaims(token, Claims::getExpiration).before(new Date());
}
Looks at the token’s expiration claim.

Compares it with the current date.

Returns true if the token has already expired.

So overall:

You configure a secret string in properties.

This class turns it into a cryptographic key.

It can generate JWTs with username + expiration.

It can extract details from tokens.

It can validate if a token is still valid and belongs to the correct user.

Would you like me to also make a flow diagram of how token generation and validation works step by step?


 */
