package com.example.secureChat.dto;

public record PostRequest(String content, Long userId) {// record使えばゲッター書かなくていいらしい。
}