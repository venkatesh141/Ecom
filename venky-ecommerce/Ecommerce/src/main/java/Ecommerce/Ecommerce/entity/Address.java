package Ecommerce.Ecommerce.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "addresses")
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String street;
    private String city;
    private String state;
    private String zipCode;
    private String country;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    /*
    @ManyToOne: This means many Address objects can be linked to one User. For example, if the system allowed storing multiple addresses (work, home, etc.), all those addresses could belong to the same user.
fetch = FetchType.LAZY: The user information connected to this address won't be loaded from the database until it is actually needed. This helps keep things fast and efficient.
@JoinColumn(name = "user_id"): This defines the column in the Address table (called user_id) that is used to store the link to the User. Think of this as a reference to the user's unique ID, so the Address knows which User it belongs to.
     */

    @Column(name = "created_at")
    private final LocalDateTime createdAt = LocalDateTime.now();
}