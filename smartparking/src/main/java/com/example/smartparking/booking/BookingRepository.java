package com.example.smartparking.booking;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository
        extends JpaRepository<Booking, Long> {

    List<Booking> findBySlotId(Long slotId);

    List<Booking> findByStatus(String status);

    List<Booking> findBySlotIdAndStartTimeLessThanAndEndTimeGreaterThan(
            Long slotId,
            LocalDateTime endTime,
            LocalDateTime startTime
    );
}