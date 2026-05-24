package com.example.secureChat.service;

import java.util.List;

import org.springframework.stereotype.Service;
import com.example.secureChat.dto.PostRequest;
import com.example.secureChat.entity.Message;
import com.example.secureChat.repository.MessageRepository;

@Service
public class PostService {
    private final MessageRepository messageRepository;

    public PostService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    public void savePost(PostRequest request) {// nomal post save database

        System.out.println("Received post content: " + request.content());
        Message message = new Message();
        message.setContent(request.content());
        messageRepository.save(message);
        System.out.println("successfully saved message to database");
    }

    public List<Message> getAllPosts() {// get all messages and return frontend
        return messageRepository.findAll();
    }
}