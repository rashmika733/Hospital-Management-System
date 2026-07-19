package com.hpms.controller;

import com.hpms.model.Doctor;
import com.hpms.service.DoctorService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "*")
public class DoctorController {

    private final DoctorService service;

    public DoctorController(DoctorService service) {
        this.service = service;
    }

    @PostMapping
    public Doctor addDoctor(@RequestBody Doctor doctor) {
        return service.saveDoctor(doctor);
    }

    @GetMapping
    public List<Doctor> getDoctors() {
        return service.getAllDoctors();
    }

    @PutMapping("/{id}")
    public Doctor updateDoctor(
            @PathVariable String id,
            @RequestBody Doctor doctor) {

        return service.updateDoctor(id, doctor);
    }

    @DeleteMapping("/{id}")
    public void deleteDoctor(@PathVariable String id) {
        service.deleteDoctor(id);
    }
}