package com.example.secureChat.dto;

public record PostRequest(String content, Long userId, Long targetUserId, Long groupId) {// record使えばゲッター書かなくていいらしい。
}