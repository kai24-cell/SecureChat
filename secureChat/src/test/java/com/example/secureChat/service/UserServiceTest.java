package com.example.secureChat.service;

import com.example.secureChat.entity.User;
import com.example.secureChat.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder; // パスワードのハッシュ化用モック

    @InjectMocks
    private UserService userService;

    @Test
    @DisplayName("異常系：メアドが被っていた場合、登録できずに例外が発生すること")
    void registerUser_Fail_DuplicateEmail() {
        // 既にそのメアドが存在するようにDB（モック）を振る舞わせる
        when(userRepository.findByEmail("test@example.com"))
                .thenReturn(Optional.of(new User()));

        // 同じメアドで登録しようとするとエラーになることを検証
        Exception exception = assertThrows(IllegalStateException.class, () -> {
            userService.registerUser("TestUser", "test@example.com", "password123");
        });
        assertEquals("このメールアドレスは既に使用されています。", exception.getMessage());
        // 保存処理が呼ばれていないことを確認
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("異常系：メアドに@が含まれていない不正なフォーマットの場合、例外が発生すること")
    void registerUser_Fail_InvalidEmailFormat() {
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            userService.registerUser("TestUser", "invalid-email-format", "password123");
        });
        assertEquals("メールアドレスの形式が不正です", exception.getMessage());

        verify(userRepository, never()).save(any(User.class));
    }

}
