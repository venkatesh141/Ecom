package Ecommerce.Ecommerce.security;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer webMvcConfigurer(){
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedMethods("GET", "POST", "PUT", "DELETE")
                        .allowedOrigins("*");
            }
        };
    }
}

/*
The class
@Configuration
public class CorsConfig {


@Configuration → tells Spring this class contains configuration (setup) code.

CorsConfig → the name of the class. This class is only about CORS rules.

The method
@Bean
public WebMvcConfigurer webMvcConfigurer() {


@Bean → Spring should create and manage this object.

WebMvcConfigurer → an interface that lets you customize Spring MVC behavior.

One of the things we can customize is CORS (Cross-Origin Resource Sharing).

👉 CORS = rules about which other websites (frontends) are allowed to call your backend APIs.

Returning a custom WebMvcConfigurer
return new WebMvcConfigurer() {
    @Override
    public void addCorsMappings(CorsRegistry registry) {


Here we return our own version of WebMvcConfigurer.

We override the method addCorsMappings → this is where we write our CORS rules.

CorsRegistry registry is like a box where you put all the rules (for paths, origins, methods, etc.).

The rules
registry.addMapping("/**")


Apply these rules to all URLs in your backend.

"/**" = match any endpoint (like /auth/login, /products/123, etc.).

.allowedMethods("GET", "POST", "PUT", "DELETE")


Allow only these HTTP methods when other websites call your backend:

GET → fetch data (example: /products)

POST → send new data (example: /auth/register)

PUT → update existing data (example: /products/1)

DELETE → delete data (example: /products/1)

👉 If someone tries to call your API with another method like PATCH or OPTIONS, it will not be allowed unless you add it here.

.allowedOrigins("*");


Allow requests from any origin (any domain / any website).

"*" means → no restrictions.
Example:

http://localhost:3000 (React app during development)

https://myfrontend.com (your deployed frontend)

Even strangers’ domains will be able to call your backend.

⚠️ Important: This is okay for testing or local development, but in production it’s not safe.
You should replace * with your actual frontend URL, like:

.allowedOrigins("http://localhost:3000", "https://myfrontend.com")

End of method + class
    }
};


Close the overridden method and the WebMvcConfigurer object.

}


End of the CorsConfig class.

✅ Simple Summary

This configuration says:

All your backend endpoints can be called from other websites.

They can use only GET, POST, PUT, DELETE methods.

Right now, any website in the world can call your backend (because of *).

 */