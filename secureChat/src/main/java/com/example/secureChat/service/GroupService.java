package com.example.secureChat.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.secureChat.entity.ChatGroup;
import com.example.secureChat.repository.ChatGroupRepository;

@Service
public class GroupService {
    private final ChatGroupRepository chatGroupRepository;

    public GroupService(ChatGroupRepository chatGroupRepository) {
        this.chatGroupRepository = chatGroupRepository;
    }

    public ChatGroup createGroup(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("グループ名は必須です");
        }
        ChatGroup group = new ChatGroup(name);
        return chatGroupRepository.save(group);
    }

    public List<ChatGroup> getAllGroups() {
        return chatGroupRepository.findAll();
    }
}
