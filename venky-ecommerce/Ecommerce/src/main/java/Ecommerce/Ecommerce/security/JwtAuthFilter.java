package Ecommerce.Ecommerce.security;


import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;


@Component
@Slf4j
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {


    private final JwtUtils jwtUtils;
    private final  CustomUserDetailsService customUserDetailsService;



    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String token = getTokenFromRequest(request);

        if (token != null){
            String username = jwtUtils.getUsernameFromToken(token);

            UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);

            if (StringUtils.hasText(username) && jwtUtils.isTokenValid(token, userDetails)){
                log.info("VALID JWT FOR {}", username);

                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities()
                );
                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }

        }
        filterChain.doFilter(request, response);
    }

    private String getTokenFromRequest(HttpServletRequest request){
        String token = request.getHeader("Authorization");
        if (StringUtils.hasText(token) && StringUtils.startsWithIgnoreCase(token, "Bearer ")){
            return token.substring(7);
        }
        return null;
    }
}
/*
Class & Annotations
@Component
@Slf4j
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {


@Component → Marks this class as a Spring bean, so Spring can automatically detect and use it.

@Slf4j → Gives you a log object to log messages easily (no need to create a Logger manually).

@RequiredArgsConstructor → Automatically creates a constructor for all final fields (dependency injection).

extends OncePerRequestFilter → This ensures the filter runs once for every HTTP request.

Fields
private final JwtUtils jwtUtils;
private final CustomUserDetailsService customUserDetailsService;


jwtUtils → A helper class you wrote (or imported) to deal with JWT (extract username, validate token, etc.).

customUserDetailsService → A service that loads user details (from DB or elsewhere) given a username.

Main Method
@Override
protected void doFilterInternal(HttpServletRequest request,
                                HttpServletResponse response,
                                FilterChain filterChain)
        throws ServletException, IOException {


doFilterInternal(...) → This is the method Spring calls for every request.

It receives:

request → Incoming HTTP request

response → Outgoing HTTP response

filterChain → Used to pass the request along to the next filter in the chain.

Extract JWT Token
String token = getTokenFromRequest(request);


Calls getTokenFromRequest() to fetch the JWT from the Authorization header of the request.

Check if Token is Present
if (token != null) {
    String username = jwtUtils.getUsernameFromToken(token);


If a token exists, extract the username from it using jwtUtils.

Load User Details
UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);


Load user details (like password, roles, permissions) from the database.

Validate Token
if (StringUtils.hasText(username) && jwtUtils.isTokenValid(token, userDetails)) {
    log.info("VALID JWT FOR {}", username);


Check if the username is not empty and the token is valid for that user.

If valid → Log it as a valid JWT.

Set Authentication
UsernamePasswordAuthenticationToken authenticationToken =
        new UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.getAuthorities()
        );

authenticationToken.setDetails(
        new WebAuthenticationDetailsSource().buildDetails(request)
);

SecurityContextHolder.getContext().setAuthentication(authenticationToken);


Create an authentication object (UsernamePasswordAuthenticationToken).

Pass:

userDetails → The authenticated user.

null → No password required (already authenticated via JWT).

userDetails.getAuthorities() → The roles/permissions of the user.

Attach request details to the authentication object.

Finally, put this authentication object into SecurityContextHolder.
👉 This tells Spring Security “This request is authenticated as this user”.

Continue the Filter Chain
}
filterChain.doFilter(request, response);


No matter what, continue with the request processing.

If token was valid → request is authenticated.

If no/invalid token → request continues but without authentication.

Helper Method
private String getTokenFromRequest(HttpServletRequest request) {
    String token = request.getHeader("Authorization");
    if (StringUtils.hasText(token) && StringUtils.startsWithIgnoreCase(token, "Bearer ")) {
        return token.substring(7);
    }
    return null;
}


Fetch the Authorization header from the request.

Check if it starts with "Bearer " (the standard way JWT is sent).

If yes → return the token without "Bearer " (the actual JWT).

Else → return null.

✅ In summary:
This filter takes the JWT from the request, extracts the username, validates the token, and if valid, sets the authenticated user in Spring Security’s context. That way, later parts of your app (controllers, services) know who the user is and what roles they have.

Do you want me to also draw a simple request flow diagram (from request → filter → authentication → controller) so it’s easier to visualize?
*/

