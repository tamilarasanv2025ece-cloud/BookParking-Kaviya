package com.example.smartparking.parking;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ParkingSlotService {

    private final ParkingSlotRepository parkingSlotRepository;

    public ParkingSlotService(
            ParkingSlotRepository parkingSlotRepository) {
        this.parkingSlotRepository = parkingSlotRepository;
    }

    // CREATE
    public ParkingSlot createSlot(ParkingSlot parkingSlot) {

        if (parkingSlotRepository.existsBySlotNumber(
                parkingSlot.getSlotNumber())) {

            throw new RuntimeException(
                    "Slot number already exists");
        }

        if (parkingSlot.getStatus() == null ||
                parkingSlot.getStatus().isBlank()) {

            parkingSlot.setStatus("AVAILABLE");
        }

        return parkingSlotRepository.save(parkingSlot);
    }

    // GET ALL
    public List<ParkingSlot> getAllSlots() {
        return parkingSlotRepository.findAll();
    }

    // GET BY ID
    public ParkingSlot getSlotById(Long id) {

        return parkingSlotRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Parking slot not found: " + id));
    }

    // GET BY SLOT NUMBER
    public ParkingSlot getSlotByNumber(String slotNumber) {

        return parkingSlotRepository
                .findBySlotNumber(slotNumber)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Parking slot not found"));
    }

    // GET AVAILABLE
    public List<ParkingSlot> getAvailableSlots() {

        return parkingSlotRepository
                .findByStatus("AVAILABLE");
    }

    // GET BY VEHICLE TYPE
    public List<ParkingSlot> getSlotsByVehicleType(
            String vehicleType) {

        return parkingSlotRepository
                .findByVehicleType(vehicleType);
    }

    // UPDATE
    public ParkingSlot updateSlot(
            Long id,
            ParkingSlot updatedSlot) {

        ParkingSlot existingSlot =
                parkingSlotRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Parking slot not found"));

        existingSlot.setSlotNumber(
                updatedSlot.getSlotNumber());

        existingSlot.setVehicleType(
                updatedSlot.getVehicleType());

        existingSlot.setLocation(
                updatedSlot.getLocation());

        existingSlot.setStatus(
                updatedSlot.getStatus());

        return parkingSlotRepository.save(existingSlot);
    }

    // UPDATE STATUS
    public ParkingSlot updateStatus(
            Long id,
            String status) {

        ParkingSlot existingSlot =
                parkingSlotRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Parking slot not found"));

        existingSlot.setStatus(status);

        return parkingSlotRepository.save(existingSlot);
    }

    // DELETE
    public void deleteSlot(Long id) {

        if (!parkingSlotRepository.existsById(id)) {
            throw new RuntimeException(
                    "Parking slot not found");
        }

        parkingSlotRepository.deleteById(id);
    }
}