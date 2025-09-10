package com.smartkart.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.smartkart.model.Product;
import com.smartkart.repo.ProductRepository;

@RestController
@RequestMapping("/api/products")
@CrossOrigin
public class ProductController {

    @Autowired
    private ProductRepository repo;

    // Get all products
    @GetMapping
    public List<Product> all() {
        return repo.findAll();
    }

    // Get a single product by ID
    @GetMapping("/{id}")
    public Product one(@PathVariable Long id) {
        return repo.findById(id).orElseThrow();
    }

    // Create a new product
    @PostMapping
    public Product create(@RequestBody Product p) {
        return repo.save(p);
    }

    // Update an existing product
    @PutMapping("/{id}")
    public Product update(@PathVariable Long id, @RequestBody Product p) {
        Product e = repo.findById(id).orElseThrow();
        e.setName(p.getName());
        e.setDescription(p.getDescription());
        e.setPrice(p.getPrice());
        e.setImageUrl(p.getImageUrl());
        e.setStock(p.getStock());
        e.setCategory(p.getCategory()); // ✅ updated with category
        return repo.save(e);
    }

    // Delete a product
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }

    // Search products by name or description
    @GetMapping("/search")
    public List<Product> search(@RequestParam("query") String query) {
        return repo.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query, query);
    }

    // ✅ New: Get products by category
    @GetMapping("/category/{category}")
    public List<Product> getByCategory(@PathVariable String category) {
        return repo.findByCategoryIgnoreCase(category);
    }
}
