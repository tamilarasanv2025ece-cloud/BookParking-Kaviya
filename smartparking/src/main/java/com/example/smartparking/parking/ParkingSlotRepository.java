package com.example.smartparking.parking;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ParkingSlotRepository
        extends JpaRepository<ParkingSlot, Long> {

    Optional<ParkingSlot> findBySlotNumber(String slotNumber);

    List<ParkingSlot> findByStatus(String status);

    List<ParkingSlot> findByVehicleType(String vehicleType);

    boolean existsBySlotNumber(String slotNumber);
}