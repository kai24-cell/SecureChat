package com.example.secureChat.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.secureChat.entity.ChatGroup;

@Repository
public interface ChatGroupRepository extends JpaRepository<ChatGroup, Long> {

}
