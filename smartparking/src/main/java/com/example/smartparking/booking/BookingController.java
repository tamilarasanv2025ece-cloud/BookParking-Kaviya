package com.example.smartparking.booking;

import com.example.smartparking.dto.BookingRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // CREATE BOOKING
    @PostMapping
    public ResponseEntity<Booking> createBooking(
            @Valid @RequestBody BookingRequest request) {

        Booking booking =
                bookingService.createBooking(request);

        return new ResponseEntity<>(
                booking,
                HttpStatus.CREATED
        );
    }

    // GET ALL BOOKINGS
    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {

        return ResponseEntity.ok(
                bookingService.getAllBookings()
        );
    }

    // GET BOOKING BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                bookingService.getBookingById(id)
        );
    }

    // GET BOOKINGS BY SLOT
    @GetMapping("/slot/{slotId}")
    public ResponseEntity<List<Booking>> getBookingsBySlotId(
            @PathVariable Long slotId) {

        return ResponseEntity.ok(
                bookingService.getBookingsBySlotId(slotId)
        );
    }

    // GET BOOKINGS BY STATUS
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Booking>> getBookingsByStatus(
            @PathVariable String status) {

        return ResponseEntity.ok(
                bookingService.getBookingsByStatus(status)
        );
    }

    // UPDATE BOOKING
    @PutMapping("/{id}")
    public ResponseEntity<Booking> updateBooking(
            @PathVariable Long id,
            @Valid @RequestBody BookingRequest request) {

        return ResponseEntity.ok(
                bookingService.updateBooking(id, request)
        );
    }

    // CANCEL BOOKING
    @PutMapping("/{id}/cancel")
    public ResponseEntity<Booking> cancelBooking(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                bookingService.cancelBooking(id)
        );
    }

    // COMPLETE BOOKING
    @PutMapping("/{id}/complete")
    public ResponseEntity<Booking> completeBooking(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                bookingService.completeBooking(id)
        );
    }

    // DELETE BOOKING
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBooking(
            @PathVariable Long id) {

        bookingService.deleteBooking(id);

        return ResponseEntity.ok(
                "Booking deleted successfully"
        );
    }
}