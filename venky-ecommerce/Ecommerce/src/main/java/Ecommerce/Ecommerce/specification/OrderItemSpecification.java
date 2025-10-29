package Ecommerce.Ecommerce.specification;

import Ecommerce.Ecommerce.entity.OrderItem;
import Ecommerce.Ecommerce.enums.OrderStatus;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;

public class OrderItemSpecification {

    /**Specification to filter order items by status*/
    public static Specification<OrderItem> hasStatus(OrderStatus status){
        return ((root, query, criteriaBuilder) ->
                status != null ? criteriaBuilder.equal(root.get("status"), status) : null);

    }

    /**Specification to filter order items by data range*/
    public static Specification<OrderItem> createdBetween(LocalDateTime startDate, LocalDateTime endDate){
        return ((root, query, criteriaBuilder) -> {
            if (startDate != null && endDate != null){
                return criteriaBuilder.between(root.get("createdAt"), startDate, endDate);
            } else if (startDate != null) {
                return criteriaBuilder.greaterThanOrEqualTo(root.get("createdAt"), startDate);
            } else if (endDate != null) {
                return criteriaBuilder.lessThanOrEqualTo(root.get("createdAt"), endDate);
            }else{
                return null;
            }
        });
    }

    /** Generate specification to filter orderitems by item id*/
    public static Specification<OrderItem> hasItemId(Long itemId){
        return ((root, query, criteriaBuilder) ->
                itemId != null ? criteriaBuilder.equal(root.get("id"), itemId) : null);
    }
}
/*
Now, line by line in simple English
1. hasStatus
public static Specification<OrderItem> hasStatus(OrderStatus status){
    return (root, query, cb) ->
            status != null ? cb.equal(root.get("status"), status) : null;
}


If you give a status (like OrderStatus.COMPLETED) → it will filter WHERE status = COMPLETED.

If you give null → no filter will be applied.

👉 Example:
hasStatus(OrderStatus.PENDING) → finds only items with status = PENDING.

2. createdBetween
public static Specification<OrderItem> createdBetween(LocalDateTime startDate, LocalDateTime endDate){
    return (root, query, cb) -> {
        if (startDate != null && endDate != null){
            return cb.between(root.get("createdAt"), startDate, endDate);
        } else if (startDate != null) {
            return cb.greaterThanOrEqualTo(root.get("createdAt"), startDate);
        } else if (endDate != null) {
            return cb.lessThanOrEqualTo(root.get("createdAt"), endDate);
        } else {
            return null;
        }
    };
}


If you give both dates → filter WHERE createdAt BETWEEN startDate AND endDate.

If you give only startDate → filter WHERE createdAt >= startDate.

If you give only endDate → filter WHERE createdAt <= endDate.

If you give neither → no filter.

👉 Example:
createdBetween(2025-01-01, 2025-01-31) → finds items created in January 2025.

3. hasItemId
public static Specification<OrderItem> hasItemId(Long itemId){
    return (root, query, cb) ->
            itemId != null ? cb.equal(root.get("id"), itemId) : null;
}


If you give an ID → filter WHERE id = itemId.

If you give null → no filter.

👉 Example:
hasItemId(10) → finds only the item with id = 10.

How do you use these?

Let’s say your repository looks like this:

public interface OrderItemRepository extends JpaRepository<OrderItem, Long>, JpaSpecificationExecutor<OrderItem> {
}


Then you can do:

Specification<OrderItem> spec = Specification
    .where(OrderItemSpecification.hasStatus(OrderStatus.PENDING))
    .and(OrderItemSpecification.createdBetween(
            LocalDateTime.of(2025,1,1,0,0),
            LocalDateTime.of(2025,1,31,23,59)))
    .and(OrderItemSpecification.hasItemId(null)); // null means ignore this filter

List<OrderItem> results = orderItemRepository.findAll(spec);


👉 This will fetch all pending orders created in Jan 2025.

✅ In one sentence:
This class gives you ready-made filters (status, date range, id) that you can combine to easily search your OrderItem table.

Would you like me to draw a simple flow diagram (Request → Specification → Database query → Results) so you can picture how it works?

root

Think of root as the table (or entity) you are querying.

It represents the starting point of your query.

Example: If you are querying OrderItem, then root.get("status") means → the status column in the order_item table.

👉 Example:

root.get("status")


= SQL column order_item.status

2. query

query represents the overall SQL query that is being built.

You usually don’t modify it in simple filters, but it’s useful if you want things like:

Sorting results

Removing duplicates

Joining with other tables

👉 Example:
If you wanted only distinct results:

query.distinct(true);

3. criteriaBuilder (often called cb)

This is a helper tool to create SQL conditions in a safe way.

It has methods like:

cb.equal() → =

cb.between() → BETWEEN x AND y

cb.greaterThanOrEqualTo() → >=

cb.lessThanOrEqualTo() → <=

👉 Example:

cb.equal(root.get("status"), OrderStatus.PENDING)


= SQL:

WHERE status = 'PENDING'

cb.between(root.get("createdAt"), startDate, endDate)


= SQL:

WHERE createdAt BETWEEN startDate AND endDate

✅ Putting it all together
(root, query, cb) -> cb.equal(root.get("status"), OrderStatus.PENDING)


root → look inside the OrderItem table

query → represents the SQL query being built (we don’t change it here)

cb.equal(...) → create the condition status = PENDING

Final SQL:

SELECT * FROM order_item WHERE status = 'PENDING';


👉 Simple analogy:

root = table name (like order_item)

query = the SQL query being built

criteriaBuilder = toolbox to add conditions (=, BETWEEN, >=, etc.)

Do you want me to show you how this Java code turns into real SQL step by step with an example filter?

ChatGPT can make mistakes. Check important info. See Cookie Preferences.
 */