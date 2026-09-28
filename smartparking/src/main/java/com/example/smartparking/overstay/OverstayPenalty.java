package com.example.smartparking.overstay;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Table(name = "overstay_penalties")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OverstayPenalty {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long penaltyId;

    @NotNull(message = "Booking ID is required")
    private Long bookingId;

    @NotNull(message = "Overstay hours are required")
    private Double overstayHours;

    @NotNull(message = "Penalty amount is required")
    private Double penaltyAmount;

    private String status;

    private String reason;
}