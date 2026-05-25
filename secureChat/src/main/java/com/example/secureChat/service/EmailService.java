package com.example.secureChat.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendRegisterEmail(String toEmail, String username) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail); // 送信先
        message.setSubject("【SecureChat公式】会員登録完了のお知らせ");
        message.setText(username + " 様\n\nSecureChatへの会員登録が完了しました！\n安心安全なチャットをお楽しみください。");

        mailSender.send(message);
    }
}
