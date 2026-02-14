package com.mynotes.starter;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.mynotes"})
public class MyNotesBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(MyNotesBackendApplication.class, args);
    }

}
