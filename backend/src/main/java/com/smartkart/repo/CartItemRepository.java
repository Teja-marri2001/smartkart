package com.smartkart.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smartkart.model.CartItem;
import com.smartkart.model.Product;
import com.smartkart.model.User;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    // Find all cart items for a specific user
    List<CartItem> findByUser(User user);

    // Find a specific cart item by user and product
    CartItem findByUserAndProduct(User user, Product product);

    // Delete all cart items for a user
    void deleteByUser(User user);
}
