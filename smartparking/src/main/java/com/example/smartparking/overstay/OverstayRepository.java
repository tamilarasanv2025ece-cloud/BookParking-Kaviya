package com.example.smartparking.overstay;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OverstayRepository
        extends JpaRepository<OverstayPenalty, Long> {

    Optional<OverstayPenalty> findByBookingId(Long bookingId);

    List<OverstayPenalty> findByStatus(String status);

    boolean existsByBookingId(Long bookingId);
}