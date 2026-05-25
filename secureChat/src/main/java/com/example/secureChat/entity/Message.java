package com.example.secureChat.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.PrePersist;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "messages")
@Data
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne // Many:message, One:user
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Later, I have to add connections Loginfunction
    @PrePersist // 調べた: PrePersistは、エンティティをデータベースに初めて保存する直前に自動で呼び出される処理やアノテーションです。
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
