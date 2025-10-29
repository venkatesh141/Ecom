package Ecommerce.Ecommerce.entity;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private String imageUrl;
    private BigDecimal price;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;
    /*
    @JoinColumn(name = "category_id"):
This tells JPA that the category_id column in the products table stores the foreign key
that links the product to its category.
     */

    @Column(name = "created_at")
    private final LocalDateTime createdAt = LocalDateTime.now();
}

