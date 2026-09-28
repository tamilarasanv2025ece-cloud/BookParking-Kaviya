package com.example.smartparking.payment;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;

    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    // POST - Create Payment
    public Payment createPayment(Payment payment) {

        if (payment.getStatus() == null ||
                payment.getStatus().isBlank()) {

            payment.setStatus("PENDING");
        }

        return paymentRepository.save(payment);
    }

    // GET - Get All Payments
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    // GET - Get Payment By ID
    public Payment getPaymentById(Long id) {

        return paymentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Payment not found with ID: " + id
                        ));
    }

    // GET - Get Payment By Booking ID
    public Payment getPaymentByBookingId(Long bookingId) {

        return paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Payment not found for booking ID: "
                                        + bookingId
                        ));
    }

    // PUT - Update Payment
    public Payment updatePayment(
            Long id,
            Payment updatedPayment) {

        Payment existingPayment =
                paymentRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Payment not found with ID: " + id
                                ));

        existingPayment.setBookingId(
                updatedPayment.getBookingId()
        );

        existingPayment.setAmount(
                updatedPayment.getAmount()
        );

        existingPayment.setPaymentMode(
                updatedPayment.getPaymentMode()
        );

        existingPayment.setStatus(
                updatedPayment.getStatus()
        );

        existingPayment.setTransactionId(
                updatedPayment.getTransactionId()
        );

        return paymentRepository.save(existingPayment);
    }

    // DELETE - Delete Payment
    public void deletePayment(Long id) {

        if (!paymentRepository.existsById(id)) {
            throw new RuntimeException(
                    "Payment not found with ID: " + id
            );
        }

        paymentRepository.deleteById(id);
    }

    // PUT - Verify Payment
    public Payment verifyPayment(Long id) {

        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Payment not found with ID: " + id
                        ));

        payment.setStatus("SUCCESS");

        return paymentRepository.save(payment);
    }
}