package Ecommerce.Ecommerce.service.interf;

import Ecommerce.Ecommerce.dto.OrderRequest;
import Ecommerce.Ecommerce.dto.Response;
import Ecommerce.Ecommerce.enums.OrderStatus;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;

public interface OrderItemService {
    Response placeOrder(OrderRequest orderRequest);
    Response updateOrderItemStatus(Long orderItemId, String status);
    Response filterOrderItems(OrderStatus status, LocalDateTime startDate, LocalDateTime endDate, Long itemId, Pageable pageable);
}