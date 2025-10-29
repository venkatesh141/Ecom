package Ecommerce.Ecommerce.controller;

import Ecommerce.Ecommerce.dto.OrderRequest;
import Ecommerce.Ecommerce.dto.Response;
import Ecommerce.Ecommerce.enums.OrderStatus;
import Ecommerce.Ecommerce.service.interf.OrderItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/order")
@RequiredArgsConstructor
public class OrderItemController {

    private final OrderItemService orderItemService;

    @PostMapping("/create")
    public ResponseEntity<Response> placeOrder(@RequestBody OrderRequest orderRequest){
        return ResponseEntity.ok(orderItemService.placeOrder(orderRequest));
    }

    @PutMapping("/update-item-status/{orderItemId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> updateOrderItemStatus(@PathVariable Long orderItemId,  @RequestParam String status){
        return ResponseEntity.ok(orderItemService.updateOrderItemStatus(orderItemId, status));
    }


    @GetMapping("/filter")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> filterOrderItems(
            // Optional request parameter: start date filter (expects ISO date-time format, e.g. 2025-09-25T10:15:30)
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,

            // Optional request parameter: end date filter
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,

            // Optional request parameter: order status filter (e.g. "PENDING", "DELIVERED")
            @RequestParam(required = false) String status,

            // Optional request parameter: filter by a specific order item ID
            @RequestParam(required = false) Long itemId,

            // Page number for pagination (default = 0 → first page)
            @RequestParam(defaultValue = "0") int page,

            // Number of records per page (default = 1000)
            @RequestParam(defaultValue = "1000") int size
    ) {
        // Create Pageable object with page, size, and sort order (descending by "id")
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));

        // Convert status string into OrderStatus enum if not null, else keep null
        OrderStatus orderStatus = status != null ? OrderStatus.valueOf(status.toUpperCase()) : null;

        // Call the service method to filter order items and return the result wrapped in ResponseEntity (HTTP 200 OK)
        return ResponseEntity.ok(orderItemService.filterOrderItems(orderStatus, startDate, endDate, itemId, pageable));
    }




}
