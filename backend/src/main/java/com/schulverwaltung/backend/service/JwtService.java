package com.schulverwaltung.backend.service;

import com.schulverwaltung.backend.enums.Role;
import com.schulverwaltung.backend.model.User;
import com.schulverwaltung.backend.security.CustomUserDetails;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JwtService {
    private final String SECRET_KEY = "c3RpbGxnYXJkZW5idXR0ZXJjb25ncmVzc2luc2lkZWdldHRpbWVkZWF0aG1vdG9yY2E=";

    public String generateToken(String username, Role role){
        Map<String,Object> claims = new HashMap<>();

        claims.put("role",role.name());

        return Jwts
                .builder()
                .subject(username)
                .claims(claims)
                .signWith(getSignKey(SECRET_KEY),Jwts.SIG.HS256)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis()+1000*60*60*24))
                .compact();
    }

    public SecretKey getSignKey(String key){
        byte[] decode = Decoders.BASE64.decode(key);
        return Keys.hmacShaKeyFor(decode);
    }

    public String extractUsernameFromToken(String token){
        return Jwts
                .parser()
                .verifyWith(getSignKey(SECRET_KEY))
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public boolean validateToken(String token, CustomUserDetails userDetails){
        Claims claim = Jwts
                .parser()
                .verifyWith(getSignKey(SECRET_KEY))
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return userDetails.getUsername().equalsIgnoreCase(claim.getSubject()) && !claim.getExpiration().before(new Date());
    }
}
