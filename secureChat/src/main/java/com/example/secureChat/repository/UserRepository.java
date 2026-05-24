package com.example.secureChat.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.secureChat.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);// ユーザー名でユーザーを検索するメソッド

    Optional<User> findByEmail(String email);// メールアドレスでユーザーを検索するメソッド

}
