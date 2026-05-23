package com.example.secureChat.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.secureChat.dto.PostRequest;
import com.example.secureChat.service.PostService;

@RestController
@RequestMapping("/api/v1/posts")
@CrossOrigin(origins = "http://localhost:5173")
public class PostController {
    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping
    public void createPost(@RequestBody PostRequest request) {
        postService.savePost(request);
    }
}