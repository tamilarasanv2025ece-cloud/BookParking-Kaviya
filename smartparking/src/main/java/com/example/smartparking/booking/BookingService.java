package com.example.smartparking.booking;

import com.example.smartparking.dto.BookingRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;

    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    // CREATE BOOKING
    public Booking createBooking(BookingRequest request) {

        // Check time
        if (request.getEndTime()
                .isBefore(request.getStartTime())) {

            throw new RuntimeException(
                    "End time must be after start time"
            );
        }

        // Check slot availability
        List<Booking> existingBookings =
                bookingRepository
                        .findBySlotIdAndStartTimeLessThanAndEndTimeGreaterThan(
                                request.getSlotId(),
                                request.getEndTime(),
                                request.getStartTime()
                        );

        if (!existingBookings.isEmpty()) {
            throw new RuntimeException(
                    "Parking slot is already booked for this time"
            );
        }

        // Create booking
        Booking booking = new Booking();

        booking.setSlotId(request.getSlotId());
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        booking.setStatus("CONFIRMED");

        return bookingRepository.save(booking);
    }

    // GET ALL BOOKINGS
    public List<Booking> getAllBookings() {

        return bookingRepository.findAll();
    }

    // GET BOOKING BY ID
    public Booking getBookingById(Long id) {

        return bookingRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Booking not found with ID: " + id
                        )
                );
    }

    // GET BOOKINGS BY SLOT
    public List<Booking> getBookingsBySlotId(Long slotId) {

        return bookingRepository.findBySlotId(slotId);
    }

    // GET BOOKINGS BY STATUS
    public List<Booking> getBookingsByStatus(String status) {

        return bookingRepository.findByStatus(status);
    }

    // UPDATE BOOKING
    public Booking updateBooking(
            Long id,
            BookingRequest request) {

        Booking existingBooking =
                bookingRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Booking not found with ID: "
                                                + id
                                )
                        );

        // Check time
        if (request.getEndTime()
                .isBefore(request.getStartTime())) {

            throw new RuntimeException(
                    "End time must be after start time"
            );
        }

        existingBooking.setSlotId(
                request.getSlotId()
        );

        existingBooking.setStartTime(
                request.getStartTime()
        );

        existingBooking.setEndTime(
                request.getEndTime()
        );

        return bookingRepository.save(existingBooking);
    }

    // CANCEL BOOKING
    public Booking cancelBooking(Long id) {

        Booking booking =
                bookingRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Booking not found with ID: "
                                                + id
                                )
                        );

        booking.setStatus("CANCELLED");

        return bookingRepository.save(booking);
    }

    // COMPLETE BOOKING
    public Booking completeBooking(Long id) {

        Booking booking =
                bookingRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Booking not found with ID: "
                                                + id
                                )
                        );

        booking.setStatus("COMPLETED");

        return bookingRepository.save(booking);
    }

    // DELETE BOOKING
    public void deleteBooking(Long id) {

        if (!bookingRepository.existsById(id)) {

            throw new RuntimeException(
                    "Booking not found with ID: " + id
            );
        }

        bookingRepository.deleteById(id);
    }
}