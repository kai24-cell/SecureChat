package com.example.secureChat.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.secureChat.entity.Message;

@Repository // メッセージテーブルと主キーのidを受け取ってる。
public interface MessageRepository extends JpaRepository<Message, Long> {
}
