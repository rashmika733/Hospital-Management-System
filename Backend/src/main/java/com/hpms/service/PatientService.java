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

        long count = patientRepository.count() + 1;

        patient.setPatientId(
                String.format("P%03d", count)
        );

        return patientRepository.save(patient);
    }

    // Get patient by MongoDB ID
    public Patient getPatientById(String id) {
        return patientRepository.findById(id).orElse(null);
    }

    // Get patient by custom Patient ID - P001
    public Patient getPatientByPatientId(String patientId) {
        return patientRepository.findByPatientId(patientId);
    }

    // Update patient
    public Patient updatePatient(String id, Patient patient) {

        Patient existingPatient =
                patientRepository.findById(id).orElse(null);

        if (existingPatient == null) {
            return null;
        }

        patient.setId(id);

        // Keep original custom patient ID
        patient.setPatientId(
                existingPatient.getPatientId()
        );

        return patientRepository.save(patient);
    }

    // Delete patient
    public void deletePatient(String id) {
        patientRepository.deleteById(id);
    }
}