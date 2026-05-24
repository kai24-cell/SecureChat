package com.example.secureChat.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();// パスワードを安全にハッシュ化するためのエンコーダーを定義
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable()) // CSRF保護をオフ
                .cors(Customizer.withDefaults()) // React側からのアクセス(@CrossOrigin)を許可
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll()); // 全てのエンドポイントを一旦許可
        return http.build();
    }
}
