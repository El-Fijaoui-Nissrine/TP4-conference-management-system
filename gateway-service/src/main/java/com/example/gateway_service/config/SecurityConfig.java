package com.example.gateway_service.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.web.cors.reactive.CorsConfigurationSource;

import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;

import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;
@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    private final JwtAuthConverter jwtAuthConverter;

    public SecurityConfig(JwtAuthConverter jwtAuthConverter) {
        this.jwtAuthConverter = jwtAuthConverter;
    }

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {

        JwtAuthConverterReactive reactiveConverter =
                new JwtAuthConverterReactive(jwtAuthConverter);

        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeExchange(exchanges -> exchanges
                        .pathMatchers(HttpMethod.GET, "/conference-service/api/conferences/**")
                        .hasAnyRole("USER","ADMIN")

                        .pathMatchers(HttpMethod.POST, "/conference-service/api/conferences/**")
                        .hasRole("ADMIN")
                        .pathMatchers(HttpMethod.PUT, "/conference-service/api/conferences/**")
                        .hasRole("ADMIN")
                        .pathMatchers(HttpMethod.DELETE, "/conference-service/api/conferences/**")
                        .hasRole("ADMIN")

                        .pathMatchers(HttpMethod.GET, "/keynote-service/api/keynotes/**")
                        .hasAnyRole("USER","ADMIN")

                        .pathMatchers(HttpMethod.POST, "/keynote-service/api/keynotes/**")
                        .hasRole("ADMIN")
                        .pathMatchers(HttpMethod.PUT, "/keynote-service/api/keynotes/**")
                        .hasRole("ADMIN")
                        .pathMatchers(HttpMethod.DELETE, "/keynote-service/api/keynotes/**")
                        .hasRole("ADMIN")

                        .anyExchange().authenticated()
                )

                .oauth2ResourceServer(oauth -> oauth
                        .jwt(jwt -> jwt.jwtAuthenticationConverter(reactiveConverter))
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Autoriser l'origine Angular
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:4200"));

        // Autoriser toutes les méthodes HTTP
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"));

        // Autoriser tous les headers
        configuration.setAllowedHeaders(Arrays.asList("*"));

        // Autoriser les credentials (important pour les cookies et Authorization header)
        configuration.setAllowCredentials(true);

        // Exposer les headers
        configuration.setExposedHeaders(Arrays.asList("Authorization", "Content-Type"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}
