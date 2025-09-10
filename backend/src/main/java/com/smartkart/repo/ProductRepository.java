package com.smartkart.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smartkart.model.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

    // Search products by name or description (case-insensitive)
    List<Product> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String name, String description);

    // ✅ New: Find products by category (case-insensitive)
    List<Product> findByCategoryIgnoreCase(String category);
}
