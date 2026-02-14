package com.mynotes.model;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    private String id;

    private String username;

    private String password;

    private String email;

    private String role; // ADMIN, USER

}
