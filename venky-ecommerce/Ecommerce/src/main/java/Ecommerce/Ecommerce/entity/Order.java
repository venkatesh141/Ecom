package Ecommerce.Ecommerce.entity;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private BigDecimal totalPrice;
    @OneToMany(mappedBy = "order", fetch = FetchType.LAZY,  cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItemList;
    /*
    Your Order entity has a list of OrderItems.
When you remove an OrderItem from this list in your Java code (for example, order.getOrderItemList().remove(someOrderItem)),
 the OrderItem will also be deleted from the database automatically.
This means the OrderItem becomes an "orphan" (no longer linked to its parent Order),
so JPA deletes it to keep the database clean.
Without orphanRemoval = true, if you remove the OrderItem from the list in Java,
the database record would remain, causing orphaned records that no longer belong to any Order.
     */

    @Column(name = "created_at")
    private final LocalDateTime createdAt = LocalDateTime.now();

    //PAYMENT
}
