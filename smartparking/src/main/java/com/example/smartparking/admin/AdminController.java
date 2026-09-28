package com.example.smartparking.admin;

import com.example.smartparking.booking.BookingRepository;
import com.example.smartparking.booking.Booking;
import com.example.smartparking.parking.ParkingSlot;
import com.example.smartparking.parking.ParkingSlotRepository;
import com.example.smartparking.payment.Payment;
import com.example.smartparking.payment.PaymentRepository;
import com.example.smartparking.overstay.OverstayPenalty;
import com.example.smartparking.overstay.OverstayRepository;
import com.example.smartparking.user.User;
import com.example.smartparking.user.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final ParkingSlotRepository parkingSlotRepository;
    private final PaymentRepository paymentRepository;
    private final OverstayRepository penaltyRepository;

    public AdminController(
            UserRepository userRepository,
            BookingRepository bookingRepository,
            ParkingSlotRepository parkingSlotRepository,
            PaymentRepository paymentRepository,
            OverstayRepository penaltyRepository) {

        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
        this.parkingSlotRepository = parkingSlotRepository;
        this.paymentRepository = paymentRepository;
        this.penaltyRepository = penaltyRepository;
    }

    // =========================
    // ADMIN DASHBOARD
    // =========================

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> dashboard() {

        Map<String, Object> dashboard = new HashMap<>();

        dashboard.put("totalUsers",
                userRepository.count());

        dashboard.put("totalBookings",
                bookingRepository.count());

        dashboard.put("totalParkingSlots",
                parkingSlotRepository.count());

        dashboard.put("totalPayments",
                paymentRepository.count());

        dashboard.put("totalPenalties",
                penaltyRepository.count());

        return ResponseEntity.ok(dashboard);
    }

    // =========================
    // VIEW ALL USERS
    // =========================

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {

        return ResponseEntity.ok(
                userRepository.findAll()
        );
    }

    // =========================
    // VIEW ALL BOOKINGS
    // =========================

    @GetMapping("/bookings")
    public ResponseEntity<List<Booking>> getAllBookings() {

        return ResponseEntity.ok(
                bookingRepository.findAll()
        );
    }

    // =========================
    // VIEW ALL PARKING SLOTS
    // =========================

    @GetMapping("/parking")
    public ResponseEntity<List<ParkingSlot>>
    getAllParkingSlots() {

        return ResponseEntity.ok(
                parkingSlotRepository.findAll()
        );
    }

    // =========================
    // VIEW ALL PAYMENTS
    // =========================

    @GetMapping("/payments")
    public ResponseEntity<List<Payment>> getAllPayments() {

        return ResponseEntity.ok(
                paymentRepository.findAll()
        );
    }

    // =========================
    // VIEW ALL OVERSTAY PENALTIES
    // =========================

    @GetMapping("/penalties")
    public ResponseEntity<List<OverstayPenalty>>
    getAllPenalties() {

        return ResponseEntity.ok(
                penaltyRepository.findAll()
        );
    }

    // =========================
    // AVAILABLE PARKING SLOTS
    // =========================

    @GetMapping("/parking/available")
    public ResponseEntity<List<ParkingSlot>>
    getAvailableSlots() {

        return ResponseEntity.ok(
                parkingSlotRepository
                        .findByStatus("AVAILABLE")
        );
    }

    // =========================
    // BOOKED PARKING SLOTS
    // =========================

    @GetMapping("/parking/booked")
    public ResponseEntity<List<ParkingSlot>>
    getBookedSlots() {

        return ResponseEntity.ok(
                parkingSlotRepository
                        .findByStatus("BOOKED")
        );
    }

    // =========================
    // PENDING PAYMENTS
    // =========================

    @GetMapping("/payments/pending")
    public ResponseEntity<List<Payment>>
    getPendingPayments() {

        return ResponseEntity.ok(
                paymentRepository
                        .findByStatus("PENDING")
        );
    }

    // =========================
    // PENDING PENALTIES
    // =========================

    @GetMapping("/penalties/pending")
    public ResponseEntity<List<OverstayPenalty>>
    getPendingPenalties() {

        return ResponseEntity.ok(
                penaltyRepository
                        .findByStatus("PENDING")
        );
    }
}