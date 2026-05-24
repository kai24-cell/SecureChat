package com.example.secureChat.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = false, length = 50) // ユーザー名は必須で、重複ありで、最大50文字-> ユーザー名重複無しにするとなんとなくUX面で不便な気がする。
    private String username;

    @Column(nullable = false, unique = true, length = 100) // メールアドレスは必須で、重複禁止で、最大100文字
    private String email;
    @Column(nullable = false) // パスワードは必須
    private String password;
    @Column(nullable = false) // ロールは必須
    private String role; // 例: "USER", "ADMIN"
    @Column(nullable = false, updatable = false) // 登録日時は必須で、更新不可
    private LocalDateTime createdAt;

    public User(String username, String email, String password, String role) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
