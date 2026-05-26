package com.example.secureChat.service;

import org.springframework.stereotype.Service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import com.example.secureChat.entity.User;
import com.example.secureChat.repository.UserRepository;

/*
明日の僕へ
堅牢性のために@でメアドの形式チェックの機能についてなんだけど、フロントエンド側だけでしか弾いてないから、バックエンド側でも同様のチェックを入れた方がよさそう。
*/
@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    public User registerUser(String username, String email, String rawpassword) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new IllegalStateException("このメールアドレスは既に使用されています。");
        }
        String hashedPassword = passwordEncoder.encode(rawpassword);
        User newUser = new User(username, email, hashedPassword, "USER");
        User savedUser = userRepository.save(newUser);
        try {
            emailService.sendRegisterEmail(email, username);
            System.out.println("登録完了メールを送信しました:");
        } catch (Exception e) {
            // メール送信に失敗してもユーザー登録は成功させる
            System.err.println("メール送信に失敗: " + e.getMessage());
        }
        return savedUser;
    }

    public User authenticate(String email, String rawPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("メールアドレスまたはパスワードが間違っています。"));
        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new IllegalStateException("メールアドレスまたはパスワードが間違っています。");
        }
        return user;
    }

    public List<com.example.secureChat.entity.User> getAllUsers() {
        return userRepository.findAll();
    }
}
