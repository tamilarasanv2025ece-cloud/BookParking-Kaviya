package com.example.smartparking.parking;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "parking_slots")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ParkingSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long slotId;

    @NotBlank(message = "Slot number is required")
    @Column(unique = true, nullable = false)
    private String slotNumber;

    @NotBlank(message = "Vehicle type is required")
    private String vehicleType;

    private String location;

    private String status;
}