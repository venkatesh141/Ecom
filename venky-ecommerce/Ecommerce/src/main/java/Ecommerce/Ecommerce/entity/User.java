package Ecommerce.Ecommerce.entity;
import Ecommerce.Ecommerce.enums.UserRole;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "users")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    @Column(unique = true)
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password number is required")
    private String password;

    @Column(name = "phone_number")
    @NotBlank(message = "Phone number is required")
    private  String phoneNumber;

    private UserRole role;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<OrderItem> orderItemList;
    /*
     Example: If you’re a customer, you might place 5 different orders. All those 5 orders belong to the same user.
mappedBy = "user" → The OrderItem table will have a column (like user_id) that points back to this User.
fetch = FetchType.LAZY → The order items are not immediately loaded when you fetch a user. They will only load when you try to access them. (saves memory)
cascade = CascadeType.ALL → Whenever you save, update, or delete a user, the same action will automatically be applied to their orders.
     */


    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL, mappedBy = "user")
    private Address address;
    /*
     One User has exactly one Address.

Example: A user account might be linked to just one home address.
mappedBy = "user" → The Address entity owns the relationship (it has a user field with @OneToOne). So the foreign key will be in the address table, not the users table.
fetch = FetchType.LAZY → The address will not be loaded immediately when you get a user. It will only be fetched when you actually call user.getAddress().
cascade = CascadeType.ALL → If you save or delete a user, the same happens automatically to the address.
     */

    @Column(name = "created_at")
    private final LocalDateTime createdAt = LocalDateTime.now();

}
