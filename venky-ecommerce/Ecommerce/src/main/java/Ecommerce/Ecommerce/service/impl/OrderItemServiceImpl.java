package Ecommerce.Ecommerce.service.impl;

// Import statements: bring in classes your code uses.
import Ecommerce.Ecommerce.dto.OrderItemDto;
import Ecommerce.Ecommerce.dto.OrderRequest;
import Ecommerce.Ecommerce.dto.Response;
import Ecommerce.Ecommerce.entity.Order;
import Ecommerce.Ecommerce.entity.OrderItem;
import Ecommerce.Ecommerce.entity.Product;
import Ecommerce.Ecommerce.entity.User;
import Ecommerce.Ecommerce.enums.OrderStatus;
import Ecommerce.Ecommerce.exception.NotFoundException;
import Ecommerce.Ecommerce.mapper.EntityDtoMapper;
import Ecommerce.Ecommerce.repository.OrderItemRepo;
import Ecommerce.Ecommerce.repository.OrderRepo;
import Ecommerce.Ecommerce.repository.ProductRepo;
import Ecommerce.Ecommerce.service.interf.OrderItemService;
import Ecommerce.Ecommerce.service.interf.UserService;
import Ecommerce.Ecommerce.specification.OrderItemSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

// Marks this class as a Spring service (a component that contains business logic).
@Service
// Lombok: generates a constructor for final fields (dependency injection friendly).
@RequiredArgsConstructor
// Lombok: provides a logger field named 'log' you can use: log.info(...).
@Slf4j
public class OrderItemServiceImpl implements OrderItemService {

    // Repositories and services injected via constructor (because of @RequiredArgsConstructor)
    private final OrderRepo orderRepo;               // used to save/fetch Order entities
    private final OrderItemRepo orderItemRepo;       // used to save/fetch OrderItem entities
    private final ProductRepo productRepo;           // used to fetch Product entities
    private final UserService userService;           // used to get the currently logged-in User
    private final EntityDtoMapper entityDtoMapper;   // used to convert entities to DTOs

    // -------------------------------
    // placeOrder: create order + order items and save to DB
    // -------------------------------
    @Override
    public Response placeOrder(OrderRequest orderRequest) {

        // Get the currently logged-in user (who places the order)
        User user = userService.getLoginUser();

        // Map each item in the incoming request to an OrderItem entity
        List<OrderItem> orderItems = orderRequest.getItems().stream().map(orderItemRequest -> {
            // For each requested item, fetch the Product from DB by ID.
            // If product not found, throw NotFoundException.
            Product product = productRepo.findById(orderItemRequest.getProductId())
                    .orElseThrow(() -> new NotFoundException("Product Not Found"));

            // Create a new OrderItem entity and set its fields
            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product); // associate the product
            orderItem.setQuantity(orderItemRequest.getQuantity()); // set quantity

            // Compute price = product price * quantity and set it.
            // product.getPrice() is a BigDecimal; multiply by quantity converted to BigDecimal.
            orderItem.setPrice(product.getPrice().multiply(BigDecimal.valueOf(orderItemRequest.getQuantity()))); // set price according to the quantity

            // Initial status for a newly placed item is PENDING
            orderItem.setStatus(OrderStatus.PENDING);

            // Associate the order item with the user who placed it
            orderItem.setUser(user);

            // Return the built OrderItem for collection
            return orderItem;

        }).collect(Collectors.toList()); // collect stream result into a List<OrderItem>

        // Calculate the total price for the order. Two possibilities:
        // 1) If the request provides a non-null, positive totalPrice, use that.
        // 2) Otherwise, sum the prices of all orderItems computed above.
        BigDecimal totalPrice = orderRequest.getTotalPrice() != null && orderRequest.getTotalPrice().compareTo(BigDecimal.ZERO) > 0
                ? orderRequest.getTotalPrice()
                : orderItems.stream().map(OrderItem::getPrice).reduce(BigDecimal.ZERO, BigDecimal::add);

        // Create a new Order entity and set its fields
        Order order = new Order();
        order.setOrderItemList(orderItems); // set the list of order items
        order.setTotalPrice(totalPrice);   // set the order total price

        // For each OrderItem, set its back-reference to the parent Order.
        // This ensures the relationship is bidirectional (if your entities expect it).
        orderItems.forEach(orderItem -> orderItem.setOrder(order));

        // Persist the Order (and usually cascading will persist OrderItems if cascade is configured).
        orderRepo.save(order);

        // Return a simple success Response DTO
        return Response.builder()
                .status(200)
                .message("Order was successfully placed")
                .build();

    }

    // -------------------------------
    // updateOrderItemStatus: change the status of a specific order item
    // -------------------------------
    @Override
    public Response updateOrderItemStatus(Long orderItemId, String status) {
        // Find the order item by ID; if not present throw NotFoundException
        OrderItem orderItem = orderItemRepo.findById(orderItemId)
                .orElseThrow(() -> new NotFoundException("Order Item not found"));

        // Convert the provided status String to the enum value.
        // valueOf will throw IllegalArgumentException if string doesn't match any enum constant.
        orderItem.setStatus(OrderStatus.valueOf(status.toUpperCase()));

        // Save the changed order item back to DB
        orderItemRepo.save(orderItem);

        // Return success response
        return Response.builder()
                .status(200)
                .message("Order status updated successfully")
                .build();
    }

    // -------------------------------
    // filterOrderItems: fetch paginated order items using specifications (filters)
    // -------------------------------
    @Override
    public Response filterOrderItems(OrderStatus status, LocalDateTime startDate, LocalDateTime endDate, Long itemId, Pageable pageable) {
        // Build a combined Specification using helper methods from OrderItemSpecification.
        // Each helper returns a Specification<OrderItem> that may be null (if filter not provided).
        Specification<OrderItem> spec = Specification.where(OrderItemSpecification.hasStatus(status))
                .and(OrderItemSpecification.createdBetween(startDate, endDate))
                .and(OrderItemSpecification.hasItemId(itemId));

        // Query repository with the combined spec and pagination info.
        Page<OrderItem> orderItemPage = orderItemRepo.findAll(spec, pageable);

        // If the result page is empty, throw NotFoundException
        if (orderItemPage.isEmpty()) {
            throw new NotFoundException("No Order Found");
        }

        // Map each OrderItem entity in the page content to OrderItemDto, including product & user info
        List<OrderItemDto> orderItemDtos = orderItemPage.getContent().stream()
                .map(entityDtoMapper::mapOrderItemToDtoPlusProductAndUser)
                .collect(Collectors.toList());

        // Return a Response DTO that contains the DTO list and pagination metadata
        return Response.builder()
                .status(200)
                .orderItemList(orderItemDtos)
                .totalPage(orderItemPage.getTotalPages())
                .totalElement(orderItemPage.getTotalElements())
                .build();
    }

}
