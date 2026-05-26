package com.example.secureChat.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.secureChat.dto.GroupRequest;
import com.example.secureChat.entity.ChatGroup;
import com.example.secureChat.service.GroupService;

@RestController
@RequestMapping("/api/v1/groups")
@CrossOrigin(origins = "http://localhost:5173")
public class GroupController {
    private final GroupService groupService;

    public GroupController(GroupService groupService) {
        this.groupService = groupService;
    }

    @PostMapping
    public ResponseEntity<?> createGroup(@RequestBody GroupRequest request) {
        try {
            ChatGroup newGroup = groupService.createGroup(request.name());
            return ResponseEntity.ok(newGroup);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getGroups() {
        return ResponseEntity.ok(groupService.getAllGroups());
    }

}
