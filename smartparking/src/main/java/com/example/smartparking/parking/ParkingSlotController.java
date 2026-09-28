package com.example.smartparking.parking;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/parking")
public class ParkingSlotController {

    private final ParkingSlotService parkingSlotService;

    public ParkingSlotController(
            ParkingSlotService parkingSlotService) {

        this.parkingSlotService = parkingSlotService;
    }

    // CREATE
    @PostMapping
    public ResponseEntity<ParkingSlot> createSlot(
            @Valid @RequestBody ParkingSlot parkingSlot) {

        return new ResponseEntity<>(
                parkingSlotService.createSlot(parkingSlot),
                HttpStatus.CREATED);
    }


    // GET ALL
    @GetMapping
    public ResponseEntity<List<ParkingSlot>> getAllSlots() {

        return ResponseEntity.ok(
                parkingSlotService.getAllSlots());
    }

    // GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<ParkingSlot> getSlotById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                parkingSlotService.getSlotById(id));
    }

    // GET BY SLOT NUMBER
    @GetMapping("/number/{slotNumber}")
    public ResponseEntity<ParkingSlot> getSlotByNumber(
            @PathVariable String slotNumber) {

        return ResponseEntity.ok(
                parkingSlotService
                        .getSlotByNumber(slotNumber));
    }

    // GET AVAILABLE
    @GetMapping("/available")
    public ResponseEntity<List<ParkingSlot>>
    getAvailableSlots() {

        return ResponseEntity.ok(
                parkingSlotService
                        .getAvailableSlots());
    }

    // GET BY VEHICLE TYPE
    @GetMapping("/vehicle/{vehicleType}")
    public ResponseEntity<List<ParkingSlot>>
    getSlotsByVehicleType(
            @PathVariable String vehicleType) {

        return ResponseEntity.ok(
                parkingSlotService
                        .getSlotsByVehicleType(vehicleType));
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<ParkingSlot> updateSlot(
            @PathVariable Long id,
            @Valid @RequestBody ParkingSlot parkingSlot) {

        return ResponseEntity.ok(
                parkingSlotService
                        .updateSlot(id, parkingSlot));
    }

    // UPDATE STATUS
    @PutMapping("/{id}/status")
    public ResponseEntity<ParkingSlot> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        return ResponseEntity.ok(
                parkingSlotService
                        .updateStatus(id, status));
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSlot(
            @PathVariable Long id) {

        parkingSlotService.deleteSlot(id);

        return ResponseEntity.ok(
                "Parking slot deleted successfully");
    }
}