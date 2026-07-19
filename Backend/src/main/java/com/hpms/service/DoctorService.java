package com.hpms.service;

import com.hpms.model.Doctor;
import com.hpms.repository.DoctorRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoctorService {

    private final DoctorRepository repository;

    public DoctorService(DoctorRepository repository) {
        this.repository = repository;
    }

    public Doctor saveDoctor(Doctor doctor) {
        return repository.save(doctor);
    }

    public List<Doctor> getAllDoctors() {
        return repository.findAll();
    }

    public Doctor updateDoctor(String id, Doctor doctor) {
        doctor.setId(id);
        return repository.save(doctor);
    }

    public void deleteDoctor(String id) {
        repository.deleteById(id);
    }
}