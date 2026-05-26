package com.example.secureChat.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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

    @GetMapping
    public ResponseEntity<?> getPosts(@RequestParam Long groupId, @RequestParam(required = false) Long userId) {
        return ResponseEntity.ok(postService.getVisiblePostsByGroup(groupId, userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable Long id, @RequestParam Long userId) {
        try {
            postService.deletePost(id, userId);
            return ResponseEntity.ok("削除しました");
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}