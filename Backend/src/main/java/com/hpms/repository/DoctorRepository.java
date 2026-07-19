package com.hpms.repository;

import com.hpms.model.Doctor;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface DoctorRepository
        extends MongoRepository<Doctor, String> {
}