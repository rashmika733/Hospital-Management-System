package com.hpms.controller;

import com.hpms.model.Patient;
import com.hpms.service.PatientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "*")
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    // Get all patients
    @GetMapping
    public List<Patient> getAllPatients() {
        return patientService.getAllPatients();
    }

    // Add new patient
    @PostMapping
    public Patient addPatient(@RequestBody Patient patient) {
        return patientService.addPatient(patient);
    }

    // Get patient by ID
    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatientById(@PathVariable String id) {
        Patient patient = patientService.getPatientById(id);

        if (patient == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(patient);
    }

    // Update patient
    @PutMapping("/{id}")
    public ResponseEntity<Patient> updatePatient(
            @PathVariable String id,
            @RequestBody Patient patient) {

        Patient existingPatient = patientService.getPatientById(id);

        if (existingPatient == null) {
            return ResponseEntity.notFound().build();
        }

        Patient updatedPatient =
                patientService.updatePatient(id, patient);

        return ResponseEntity.ok(updatedPatient);
    }

    // Delete patient
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatient(@PathVariable String id) {

        Patient existingPatient = patientService.getPatientById(id);

        if (existingPatient == null) {
            return ResponseEntity.notFound().build();
        }

        patientService.deletePatient(id);

        return ResponseEntity.noContent().build();
    }
}
