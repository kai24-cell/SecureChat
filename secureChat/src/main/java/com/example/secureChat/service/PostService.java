package com.example.secureChat.service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.secureChat.dto.PostRequest;
import com.example.secureChat.entity.Message;
import com.example.secureChat.entity.User;
import com.example.secureChat.entity.ChatGroup;
import com.example.secureChat.repository.ChatGroupRepository;
import com.example.secureChat.repository.MessageRepository;
import com.example.secureChat.repository.UserRepository;

@Service
public class PostService {
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final ChatGroupRepository chatGroupRepository;

    public PostService(MessageRepository messageRepository, UserRepository userRepository,
            ChatGroupRepository chatGroupRepository) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.chatGroupRepository = chatGroupRepository;
    }

    public void savePost(PostRequest request) {// nomal post save database

        System.out.println("Received post content: " + request.content());
        if (request.groupId() == null) {
            throw new IllegalArgumentException("投稿先のグループが指定されていません");// これ入れたほうが堅牢性上がりそう。
        }

        User author = userRepository.findById(request.userId())
                .orElseThrow(() -> new IllegalArgumentException("ユーザーが見つかりません: "));
        Message message = new Message();
        message.setContent(request.content());
        message.setUser(author);

        ChatGroup group = chatGroupRepository.findById(request.groupId())
                .orElseThrow(() -> new IllegalArgumentException("グループが見つかりません: "));

        message.setChatGroup(group);
        if (request.targetUserId() != null) {
            User target = userRepository.findById(request.targetUserId())
                    .orElseThrow(() -> new IllegalArgumentException("宛先のユーザーが見つかりません"));
            message.setTargetUser(target);
        }
        messageRepository.save(message);
        System.out.println("successfully saved message to database");
    }

    public List<Message> getVisiblePosts(Long currentUserId) {
        return messageRepository.findAll().stream()
                .filter(m -> m.getTargetUser() == null ||
                        (currentUserId != null && (m.getUser().getId().equals(currentUserId) ||
                                m.getTargetUser().getId().equals(currentUserId))))
                .collect(Collectors.toList());
    }

    public List<Message> getAllPosts() {// get all messages and return frontend
        return messageRepository.findAll();
    }

    public void deletePost(Long postId, Long userId) {
        Message message = messageRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("メッセージが見つかりません"));

        if (!Objects.equals(message.getUser().getId(), userId)) {
            throw new SecurityException("他のユーザーのメッセージは削除できません");
        }
        messageRepository.delete(message);
    }

    public List<Message> getVisiblePostsByGroup(Long groupId, Long currentUserId) {
        return messageRepository.findAll().stream()
                .filter(m -> m.getChatGroup().getId().equals(groupId))
                .filter(m -> m.getTargetUser() == null ||
                        (currentUserId != null && (m.getUser().getId().equals(currentUserId) ||
                                m.getTargetUser().getId().equals(currentUserId))))
                .collect(Collectors.toList());
    }
}