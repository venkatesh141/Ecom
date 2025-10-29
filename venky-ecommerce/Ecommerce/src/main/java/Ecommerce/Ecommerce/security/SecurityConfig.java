    package Ecommerce.Ecommerce.security;

    import lombok.RequiredArgsConstructor;
    import org.springframework.context.annotation.Bean;
    import org.springframework.context.annotation.Configuration;
    import org.springframework.security.authentication.AuthenticationManager;
    import org.springframework.security.config.Customizer;
    import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
    import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
    import org.springframework.security.config.annotation.web.builders.HttpSecurity;
    import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
    import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
    import org.springframework.security.config.http.SessionCreationPolicy;
    import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
    import org.springframework.security.crypto.password.PasswordEncoder;
    import org.springframework.security.web.SecurityFilterChain;
    import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

    @Configuration
    @EnableWebSecurity
    @EnableMethodSecurity
    @RequiredArgsConstructor
    public class SecurityConfig {

        private final JwtAuthFilter jwtAuthFilter;

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception{
            httpSecurity.csrf(AbstractHttpConfigurer::disable)
                    .cors(Customizer.withDefaults())
                    .authorizeHttpRequests(request -> request
                            .requestMatchers(
                                    "/auth/**",
                                    "/category/**",
                                    "/product/**",
                                    "/order/**"

                            ).permitAll()
                            .anyRequest().authenticated()
                    )

                    .sessionManagement(manager-> manager.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                    .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
            return httpSecurity.build();
        }

        @Bean
        public PasswordEncoder passwordEncoder(){
            return new BCryptPasswordEncoder();
        }

        @Bean
        public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
            return authenticationConfiguration.getAuthenticationManager();
        }
    }
    /*
    What this class does

    This class tells Spring Security:

    Which URLs are public and which need login (JWT).

    How to check passwords.

    How to use your JWT filter.

    Don’t use sessions, use JWT only.

    Step by step
    @Configuration
    @EnableWebSecurity
    @EnableMethodSecurity
    @RequiredArgsConstructor
    public class SecurityConfig {


    @Configuration → this class gives Spring some setup instructions.

    @EnableWebSecurity → turn on web security.

    @EnableMethodSecurity → allows you to use things like @PreAuthorize("hasRole('ADMIN')") on methods.

    @RequiredArgsConstructor → Spring will automatically give values to the final fields.

    private final JwtAuthFilter jwtAuthFilter;


    You are telling Spring: “Use my custom JWT filter in the security system.”

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {


    This creates the main security rules for your app.

    httpSecurity.csrf(AbstractHttpConfigurer::disable)


    Turn off CSRF protection (not needed for JWT-based APIs).

    .cors(Customizer.withDefaults())


    Turn on CORS so your frontend can call the backend from another domain.

    .authorizeHttpRequests(request -> request
            .requestMatchers("/auth/**", "/category/**", "/product/**", "/order/**").permitAll()
            .anyRequest().authenticated())


    Some URLs are public:

    /auth/** (login/register)

    /category/**

    /product/**

    /order/**

    Every other URL needs authentication (JWT).

    .sessionManagement(manager -> manager.sessionCreationPolicy(SessionCreationPolicy.STATELESS))


    No sessions. Each request must bring its JWT token.

    .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);


    Add your JWT filter before Spring’s username/password filter.

    This means JWT is checked first for every request.

    return httpSecurity.build();


    Finish and return the security rules.

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }


    Passwords will be stored in BCrypt hash form (more secure than plain text).

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }


    Provides an AuthenticationManager (used when you log in with username/password).

    Example: you call it in your login API to check if username + password are correct.

    ✅ In super simple words:

    Some endpoints are public, others need a valid JWT.

    No sessions, only JWT tokens.

    Passwords are encoded with BCrypt.

    Your custom JWT filter is plugged into Spring’s security system.

    Would you like me to also draw a small diagram showing the request flow (how a request goes through filter → validation → controller) so it’s easier to picture?

    Is this conversation helpful so far?

     */