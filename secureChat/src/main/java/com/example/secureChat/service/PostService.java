package com.example.secureChat.service;

import org.springframework.stereotype.Service;
import com.example.secureChat.dto.PostRequest;

@Service
public class PostService {
    public void savePost(PostRequest request) {// ポスト(普通)の保存とchat欄の表示
        System.out.println("Received post content: " + request.content());
    }
}