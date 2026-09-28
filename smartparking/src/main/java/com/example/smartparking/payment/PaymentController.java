package com.example.smartparking.payment;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // POST
    @PostMapping
    public ResponseEntity<Payment> createPayment(
            @Valid @RequestBody Payment payment) {

        Payment savedPayment =
                paymentService.createPayment(payment);

        return new ResponseEntity<>(
                savedPayment,
                HttpStatus.CREATED
        );
    }

    // GET - All
    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments() {

        return ResponseEntity.ok(
                paymentService.getAllPayments()
        );
    }

    // GET - By ID
    @GetMapping("/{id}")
    public ResponseEntity<Payment> getPaymentById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                paymentService.getPaymentById(id)
        );
    }

    // GET - By Booking ID
    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<Payment> getPaymentByBookingId(
            @PathVariable Long bookingId) {

        return ResponseEntity.ok(
                paymentService.getPaymentByBookingId(bookingId)
        );
    }

    // PUT - Update
    @PutMapping("/{id}")
    public ResponseEntity<Payment> updatePayment(
            @PathVariable Long id,
            @Valid @RequestBody Payment payment) {

        return ResponseEntity.ok(
                paymentService.updatePayment(id, payment)
        );
    }

    // PUT - Verify Payment
    @PutMapping("/{id}/verify")
    public ResponseEntity<Payment> verifyPayment(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                paymentService.verifyPayment(id)
        );
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePayment(
            @PathVariable Long id) {

        paymentService.deletePayment(id);

        return ResponseEntity.ok(
                "Payment deleted successfully"
        );
    }
}