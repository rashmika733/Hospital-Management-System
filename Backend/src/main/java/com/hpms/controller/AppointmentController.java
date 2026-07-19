package com.hpms.controller;

import com.hpms.model.Appointment;
import com.hpms.service.AppointmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService
            appointmentService;

    public AppointmentController(
            AppointmentService appointmentService
    ) {
        this.appointmentService =
                appointmentService;
    }

    @GetMapping
    public List<Appointment> getAllAppointments() {

        return appointmentService
                .getAllAppointments();
    }

    @GetMapping("/{appointmentId}")
    public ResponseEntity<?> getAppointmentById(
            @PathVariable String appointmentId
    ) {

        return appointmentService
                .getAppointmentById(appointmentId)
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity
                                .notFound()
                                .build()
                );
    }

    @PostMapping
    public ResponseEntity<?> addAppointment(
            @RequestBody Appointment appointment
    ) {

        try {

            Appointment savedAppointment =
                    appointmentService
                            .addAppointment(appointment);

            return ResponseEntity.ok(
                    savedAppointment
            );

        } catch (RuntimeException exception) {

            return ResponseEntity
                    .badRequest()
                    .body(exception.getMessage());
        }
    }

    @PutMapping("/{appointmentId}")
    public ResponseEntity<?> updateAppointment(
            @PathVariable String appointmentId,
            @RequestBody Appointment appointment
    ) {

        try {

            Appointment updatedAppointment =
                    appointmentService
                            .updateAppointment(
                                    appointmentId,
                                    appointment
                            );

            return ResponseEntity.ok(
                    updatedAppointment
            );

        } catch (RuntimeException exception) {

            return ResponseEntity
                    .badRequest()
                    .body(exception.getMessage());
        }
    }

    @DeleteMapping("/{appointmentId}")
    public ResponseEntity<String> deleteAppointment(
            @PathVariable String appointmentId
    ) {

        try {

            appointmentService
                    .deleteAppointment(appointmentId);

            return ResponseEntity.ok(
                    "Appointment deleted successfully."
            );

        } catch (RuntimeException exception) {

            return ResponseEntity
                    .badRequest()
                    .body(exception.getMessage());
        }
    }
}