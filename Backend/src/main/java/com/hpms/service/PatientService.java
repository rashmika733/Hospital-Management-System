package com.hpms.service;

import com.hpms.model.Patient;
import com.hpms.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    // Get all patients
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    // Add new patient
    public Patient addPatient(Patient patient) {
        return patientRepository.save(patient);
    }

    // Get patient by ID
    public Patient getPatientById(String id) {
        return patientRepository.findById(id).orElse(null);
    }

    // Update patient
    public Patient updatePatient(String id, Patient patient) {
        patient.setId(id);
        return patientRepository.save(patient);
    }

    // Delete patient
    public void deletePatient(String id) {
        patientRepository.deleteById(id);
    }
}