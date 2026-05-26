package com.example.secureChat.service;

import com.example.secureChat.dto.PostRequest;
import com.example.secureChat.entity.Message;
import com.example.secureChat.repository.ChatGroupRepository;
import com.example.secureChat.repository.MessageRepository;
import com.example.secureChat.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PostServiceTest {

    @Mock
    private MessageRepository messageRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private ChatGroupRepository chatGroupRepository;

    @InjectMocks
    private PostService postService;

    @Test
    @DisplayName("異常系：ログインしていない（userIdがnull）場合、投稿できないこと")
    void savePost_Fail_NullUserId() {
        PostRequest request = new PostRequest("Hello", null, null, 1L);

        assertThrows(IllegalArgumentException.class, () -> {
            postService.savePost(request);
        });
        verify(messageRepository, never()).save(any(Message.class));
    }

    @Test
    @DisplayName("異常系：グループ未所属（groupIdがnull）の場合、投稿できないこと")
    void savePost_Fail_NullGroupId() {
        PostRequest request = new PostRequest("Hello", 1L, null, null);

        assertThrows(IllegalArgumentException.class, () -> {
            postService.savePost(request);
        });
        verify(messageRepository, never()).save(any(Message.class));
    }

    @Test
    @DisplayName("異常系：ログインしておらず、グループも未所属（両方null）の場合、投稿できないこと")
    void savePost_Fail_NullUserAndGroup() {
        PostRequest request = new PostRequest("Hello", null, null, null);

        assertThrows(IllegalArgumentException.class, () -> {
            postService.savePost(request);
        });
        verify(messageRepository, never()).save(any(Message.class));
    }
}