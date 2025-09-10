package com.smartkart.model;

import java.math.BigDecimal;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    private String description;

    @NotNull
    private BigDecimal price;

    private String imageUrl;

    private Integer stock = 0;

    // ✅ New field for category
    private String category;

    // --- Getters and Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String n) { this.name = n; }

    public String getDescription() { return description; }
    public void setDescription(String d) { this.description = d; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal p) { this.price = p; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String i) { this.imageUrl = i; }

    public Integer getStock() { return stock; }
    public void setStock(Integer s) { this.stock = s; }

    public String getCategory() { return category; }       // ✅ getter
    public void setCategory(String category) { this.category = category; } // ✅ setter
}
