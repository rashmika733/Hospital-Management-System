package com.hpms.repository;

import com.hpms.model.Appointment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AppointmentRepository
        extends MongoRepository<Appointment, String> {

    Optional<Appointment> findByAppointmentId(
            String appointmentId
    );

    boolean existsByAppointmentId(
            String appointmentId
    );
}