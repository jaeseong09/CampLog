package com.camplog;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class CamplogApplication {

    public static void main(String[] args) {
        SpringApplication.run(CamplogApplication.class, args);
    }

}