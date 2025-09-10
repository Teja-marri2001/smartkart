package com.smartkart.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.smartkart.model.CartItem;
import com.smartkart.model.Product;
import com.smartkart.model.User;
import com.smartkart.repo.CartItemRepository;
import com.smartkart.repo.ProductRepository;
import com.smartkart.repo.UserRepository;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin
public class CartController {

    @Autowired
    private CartItemRepository cartRepo;

    @Autowired
    private ProductRepository productRepo;

    @Autowired
    private UserRepository userRepo;

    // Get all items in the cart for the logged-in user
    @GetMapping
    public List<CartItem> myCart(Authentication auth) {
        User u = userRepo.findByEmail(auth.getName()).orElseThrow();
        return cartRepo.findByUser(u);
    }

    // Add product to cart
    @PostMapping("/add/{productId}")
    public CartItem add(Authentication auth, @PathVariable Long productId) {
        User u = userRepo.findByEmail(auth.getName()).orElseThrow();
        Product p = productRepo.findById(productId).orElseThrow();

        // Check if item already exists in cart
        CartItem existing = cartRepo.findByUserAndProduct(u, p);
        if (existing != null) {
            existing.setQuantity(existing.getQuantity() + 1);
            return cartRepo.save(existing);
        }

        CartItem ci = new CartItem();
        ci.setUser(u);
        ci.setProduct(p);
        ci.setQuantity(1);
        return cartRepo.save(ci);
    }

    // Update quantity of a specific cart item
    @PutMapping("/update/{cartItemId}")
    public CartItem updateQuantity(Authentication auth,
                                   @PathVariable Long cartItemId,
                                   @RequestParam int quantity) {
        User u = userRepo.findByEmail(auth.getName()).orElseThrow();
        CartItem ci = cartRepo.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (!ci.getUser().getId().equals(u.getId())) {
            throw new RuntimeException("Not authorized");
        }

        if (quantity <= 0) {
            throw new RuntimeException("Quantity must be at least 1");
        }

        ci.setQuantity(quantity);
        return cartRepo.save(ci);
    }

    // Remove a single item from cart
    @DeleteMapping("/remove/{cartItemId}")
    public String removeItem(Authentication auth, @PathVariable Long cartItemId) {
        User u = userRepo.findByEmail(auth.getName()).orElseThrow();
        CartItem ci = cartRepo.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (!ci.getUser().getId().equals(u.getId())) {
            throw new RuntimeException("Not authorized");
        }

        cartRepo.delete(ci);
        return "Item removed successfully";
    }

    // Clear entire cart
    @DeleteMapping("/clear")
    public void clear(Authentication auth) {
        User u = userRepo.findByEmail(auth.getName()).orElseThrow();
        cartRepo.deleteByUser(u);
    }

   // Increment quantity of a cart item
@PostMapping("/increment/{cartItemId}")
public CartItem increment(Authentication auth, @PathVariable Long cartItemId) {
    User u = userRepo.findByEmail(auth.getName()).orElseThrow();
    CartItem ci = cartRepo.findById(cartItemId).orElseThrow(() -> new RuntimeException("Cart item not found"));

    if (!ci.getUser().getId().equals(u.getId())) {
        throw new RuntimeException("Not authorized");
    }

    ci.setQuantity(ci.getQuantity() + 1);
    return cartRepo.save(ci);
}


// Decrement quantity of a cart item
@PostMapping("/decrement/{cartItemId}")
public CartItem decrement(Authentication auth, @PathVariable Long cartItemId) {
    User u = userRepo.findByEmail(auth.getName()).orElseThrow();
    CartItem ci = cartRepo.findById(cartItemId).orElseThrow(() -> new RuntimeException("Cart item not found"));

    if (!ci.getUser().getId().equals(u.getId())) {
        throw new RuntimeException("Not authorized");
    }

    // Ensure quantity does not go below 1
    if (ci.getQuantity() > 1) {
        ci.setQuantity(ci.getQuantity() - 1);
        return cartRepo.save(ci);
    }

    return ci;
}

@GetMapping("/total")
public BigDecimal total(Authentication auth) {
    User u = userRepo.findByEmail(auth.getName()).orElseThrow();
    return cartRepo.findByUser(u).stream()
            .map(item -> item.getProduct().getPrice()
                    .multiply(BigDecimal.valueOf(item.getQuantity())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
}


}


