package com.example.secureChat.service;

import com.example.secureChat.entity.ChatGroup;
import com.example.secureChat.repository.ChatGroupRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GroupServiceTest {

    @Mock
    private ChatGroupRepository chatGroupRepository;

    @InjectMocks
    private GroupService groupService;

    private ChatGroup dummyGroup;

    @BeforeEach
    void setUp() {
        dummyGroup = new ChatGroup("Test Group");
        dummyGroup.setId(1L);
    }

    @Test
    @DisplayName("正常系：正しいグループ名が渡された場合、新しくグループが保存されること")
    void createGroup_Success() {
        // リポジトリのsaveメソッドが呼ばれたら、dummyGroupを返すように設定
        when(chatGroupRepository.save(any(ChatGroup.class))).thenReturn(dummyGroup);
        ChatGroup result = groupService.createGroup("Test Group");
        assertNotNull(result);
        assertEquals("Test Group", result.getName());
        assertEquals(1L, result.getId());
        // saveメソッドが1回だけ呼ばれたことを検証
        verify(chatGroupRepository, times(1)).save(any(ChatGroup.class));
    }

    @Test
    @DisplayName("異常系：グループ名がnullの場合、例外がスローされること")
    void createGroup_Fail_NullName() {
        // nullを渡すとIllegalArgumentExceptionが発生することを検証
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            groupService.createGroup(null);
        });
        assertEquals("グループ名は必須です", exception.getMessage());

        // 例外で処理が止まるため、saveメソッドは1回も呼ばれていないはず
        verify(chatGroupRepository, never()).save(any(ChatGroup.class));
    }

    @Test
    @DisplayName("正常系：保存されている全グループのリストが取得できること")
    void getAllGroups_Success() {
        // リポジトリがダミーのリストを返すように設定
        List<ChatGroup> dummyList = Arrays.asList(dummyGroup, new ChatGroup("Group 2"));
        when(chatGroupRepository.findAll()).thenReturn(dummyList);
        List<ChatGroup> result = groupService.getAllGroups();

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Test Group", result.get(0).getName());

        verify(chatGroupRepository, times(1)).findAll();
    }
}