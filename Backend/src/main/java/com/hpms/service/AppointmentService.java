package com.hpms.service;

import com.hpms.model.Appointment;
import com.hpms.repository.AppointmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {

    private final AppointmentRepository
            appointmentRepository;

    public AppointmentService(
            AppointmentRepository appointmentRepository
    ) {
        this.appointmentRepository =
                appointmentRepository;
    }

    public List<Appointment> getAllAppointments() {

        return appointmentRepository.findAll();
    }

    public Optional<Appointment> getAppointmentById(
            String appointmentId
    ) {

        return appointmentRepository
                .findByAppointmentId(appointmentId);
    }

    public Appointment addAppointment(
            Appointment appointment
    ) {

        validateAppointment(appointment);

        String appointmentId =
                appointment.getAppointmentId()
                        .trim()
                        .toUpperCase();

        appointment.setAppointmentId(appointmentId);

        if (appointmentRepository
                .existsByAppointmentId(appointmentId)) {

            throw new RuntimeException(
                    "Appointment ID already exists."
            );
        }

        return appointmentRepository.save(appointment);
    }

    public Appointment updateAppointment(
            String appointmentId,
            Appointment updatedAppointment
    ) {

        Appointment existingAppointment =
                appointmentRepository
                        .findByAppointmentId(appointmentId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Appointment not found."
                                )
                        );

        validateAppointment(updatedAppointment);

        /*
         * Appointment ID is not changed during editing.
         * The existing MongoDB document is updated.
         */
        existingAppointment.setPatientName(
                updatedAppointment.getPatientName()
        );

        existingAppointment.setDoctorName(
                updatedAppointment.getDoctorName()
        );

        existingAppointment.setSpecialization(
                updatedAppointment.getSpecialization()
        );

        existingAppointment.setAppointmentDate(
                updatedAppointment.getAppointmentDate()
        );

        existingAppointment.setAppointmentTime(
                updatedAppointment.getAppointmentTime()
        );

        existingAppointment.setStatus(
                updatedAppointment.getStatus()
        );

        existingAppointment.setReason(
                updatedAppointment.getReason()
        );

        return appointmentRepository.save(
                existingAppointment
        );
    }

    public void deleteAppointment(
            String appointmentId
    ) {

        Appointment appointment =
                appointmentRepository
                        .findByAppointmentId(appointmentId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Appointment not found."
                                )
                        );

        appointmentRepository.delete(appointment);
    }

    private void validateAppointment(
            Appointment appointment
    ) {

        if (appointment.getAppointmentId() == null ||
                !appointment.getAppointmentId()
                        .trim()
                        .toUpperCase()
                        .matches("^A\\d{3}$")) {

            throw new RuntimeException(
                    "Appointment ID must be like A001."
            );
        }

        if (appointment.getPatientName() == null ||
                appointment.getPatientName()
                        .trim()
                        .isEmpty()) {

            throw new RuntimeException(
                    "Patient name is required."
            );
        }

        if (appointment.getDoctorName() == null ||
                appointment.getDoctorName()
                        .trim()
                        .isEmpty()) {

            throw new RuntimeException(
                    "Doctor name is required."
            );
        }

        if (appointment.getSpecialization() == null ||
                appointment.getSpecialization()
                        .trim()
                        .isEmpty()) {

            throw new RuntimeException(
                    "Specialization is required."
            );
        }

        if (appointment.getAppointmentDate() == null ||
                appointment.getAppointmentDate()
                        .trim()
                        .isEmpty()) {

            throw new RuntimeException(
                    "Appointment date is required."
            );
        }

        if (appointment.getAppointmentTime() == null ||
                appointment.getAppointmentTime()
                        .trim()
                        .isEmpty()) {

            throw new RuntimeException(
                    "Appointment time is required."
            );
        }

        if (appointment.getStatus() == null ||
                appointment.getStatus()
                        .trim()
                        .isEmpty()) {

            throw new RuntimeException(
                    "Appointment status is required."
            );
        }
    }
}