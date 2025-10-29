package Ecommerce.Ecommerce.repository;

import Ecommerce.Ecommerce.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface OrderItemRepo extends JpaRepository<OrderItem, Long>, JpaSpecificationExecutor<OrderItem> {

}
/*
What is JpaSpecificationExecutor?
It is an interface in Spring Data JPA that helps you run dynamic and complex queries using something called Specifications (a way to define conditions).
Think of it like this:
JpaRepository → fixed queries (basic ones).
JpaSpecificationExecutor → custom search filters where conditions can be built at runtime.
Example in Real Life
Suppose you have an OrderItem table with columns:
id
productName
quantity
price
Now you want to search with conditions like:
All items where price > 500
All items where productName = "Laptop" and quantity > 2
Instead of writing a new query method each time, you can use Specifications.
How it works
You extend your repo with JpaSpecificationExecutor<OrderItem>.
You write a Specification (condition).
You call repo methods like:
findAll(Specification spec)
count(Specification spec)
findOne(Specification spec)
Simple Example Code

// Example: Find OrderItems with price greater than 500
Specification<OrderItem> priceGreaterThan500 = (root, query, criteriaBuilder) ->
        criteriaBuilder.greaterThan(root.get("price"), 500);

// Usage in Service
List<OrderItem> expensiveItems = orderItemRepo.findAll(priceGreaterThan500);

// Ex
 */

