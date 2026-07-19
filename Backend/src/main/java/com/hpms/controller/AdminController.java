package com.hpms.controller;

import com.hpms.dto.LoginRequest;
import com.hpms.model.Admin;
import com.hpms.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admins")
@CrossOrigin(origins = "*")
public class AdminController {

    private final AdminService service;

    public AdminController(AdminService service) {
        this.service = service;
    }

    @GetMapping
    public List<Admin> getAllAdmins() {
        return service.getAllAdmins();
    }

    @PostMapping
    public Admin saveAdmin(@RequestBody Admin admin) {
        return service.saveAdmin(admin);
    }

    @PutMapping("/{id}")
    public Admin updateAdmin(
            @PathVariable String id,
            @RequestBody Admin admin) {

        return service.updateAdmin(id, admin);
    }

    @DeleteMapping("/{id}")
    public void deleteAdmin(@PathVariable String id) {
        service.deleteAdmin(id);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request) {

        return service.login(
                        request.getEmail(),
                        request.getPassword())
                .<ResponseEntity<?>>map(admin ->
                        ResponseEntity.ok(admin))
                .orElseGet(() ->
                        ResponseEntity.badRequest()
                                .body("Invalid Email or Password"));
    }
}