package com.camplog.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    private final SecretKey secretKey;
    private final long expiration;
    private final long refreshExpiration;

    public JwtUtil(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration}") long expiration,
            @Value("${jwt.refresh-expiration}") long refreshExpiration) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes());
        this.expiration = expiration;
        this.refreshExpiration = refreshExpiration;
    }

    // 액세스 토큰 생성
    public String generateToken(String email) {
        return buildToken(email, expiration, "access");
    }

    // 리프레시 토큰 생성
    public String generateRefreshToken(String email) {
        return buildToken(email, refreshExpiration, "refresh");
    }

    private String buildToken(String email, long expirationMs, String type) {
        return Jwts.builder()
                .subject(email)
                .claim("type", type)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(secretKey)
                .compact();
    }

    // 토큰에서 이메일 꺼내기
    public String getEmail(String token) {
        return getClaims(token).getSubject();
    }

    // 액세스 토큰인지 검증 (서명 + 만료 + type=access)
    public boolean isValidAccessToken(String token) {
        try {
            Claims claims = getClaims(token);
            return "access".equals(claims.get("type", String.class));
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // 리프레시 토큰인지 검증 (서명 + 만료 + type=refresh)
    public boolean isValidRefreshToken(String token) {
        try {
            Claims claims = getClaims(token);
            return "refresh".equals(claims.get("type", String.class));
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // 하위 호환용 (내부에서만 사용)
    public boolean isValid(String token) {
        try {
            getClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}