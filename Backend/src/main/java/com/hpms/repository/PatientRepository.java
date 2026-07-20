package com.hpms.repository;

import com.hpms.model.Patient;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PatientRepository
        extends MongoRepository<Patient, String> {

    Patient findByPatientId(String patientId);
}