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

    public PatientController(
            PatientService patientService) {

        this.patientService = patientService;
    }

    @GetMapping
    public List<Patient> getAllPatients() {
        return patientService.getAllPatients();
    }

    @PostMapping
    public Patient addPatient(
            @RequestBody Patient patient) {

        return patientService.addPatient(patient);
    }

    // Find using P001
    @GetMapping("/patient-id/{patientId}")
    public ResponseEntity<Patient> getPatientByPatientId(
            @PathVariable String patientId) {

        Patient patient =
                patientService.getPatientByPatientId(
                        patientId.toUpperCase()
                );

        if (patient == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(patient);
    }

    // Find using MongoDB ID
    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatientById(
            @PathVariable String id) {

        Patient patient =
                patientService.getPatientById(id);

        if (patient == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(patient);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Patient> updatePatient(
            @PathVariable String id,
            @RequestBody Patient patient) {

        Patient updatedPatient =
                patientService.updatePatient(id, patient);

        if (updatedPatient == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updatedPatient);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatient(
            @PathVariable String id) {

        Patient existingPatient =
                patientService.getPatientById(id);

        if (existingPatient == null) {
            return ResponseEntity.notFound().build();
        }

        patientService.deletePatient(id);

        return ResponseEntity.noContent().build();
    }
}