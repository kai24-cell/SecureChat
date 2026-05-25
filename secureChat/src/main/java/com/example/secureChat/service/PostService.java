package com.example.secureChat.service;

import java.util.List;

import org.springframework.stereotype.Service;
import com.example.secureChat.dto.PostRequest;
import com.example.secureChat.entity.Message;
import com.example.secureChat.entity.User;
import com.example.secureChat.repository.MessageRepository;
import com.example.secureChat.repository.UserRepository;

@Service
public class PostService {
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public PostService(MessageRepository messageRepository, UserRepository userRepository) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }

    public void savePost(PostRequest request) {// nomal post save database

        System.out.println("Received post content: " + request.content());
        User author = userRepository.findById(request.userId())
                .orElseThrow(() -> new IllegalArgumentException("ユーザーが見つかりません: "));
        Message message = new Message();
        message.setContent(request.content());
        message.setUser(author);
        messageRepository.save(message);
        System.out.println("successfully saved message to database");
    }

    public List<Message> getAllPosts() {// get all messages and return frontend
        return messageRepository.findAll();
    }
}