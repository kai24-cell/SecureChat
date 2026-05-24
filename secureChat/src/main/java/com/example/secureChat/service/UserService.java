package com.example.secureChat.service;

import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.example.secureChat.entity.User;
import com.example.secureChat.repository.UserRepository;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User registerUser(String username, String email, String rawpassword) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new IllegalStateException("このメールアドレスは既に使用されています。");
        }
        String hashedPassword = passwordEncoder.encode(rawpassword);
        User newUser = new User(username, email, hashedPassword, "USER");
        return userRepository.save(newUser);
    }
}
