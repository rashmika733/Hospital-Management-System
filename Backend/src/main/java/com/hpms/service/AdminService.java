package com.hpms.service;

import com.hpms.model.Admin;
import com.hpms.repository.AdminRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminService {

    private final AdminRepository repository;

    public AdminService(AdminRepository repository) {
        this.repository = repository;
    }

    public List<Admin> getAllAdmins() {
        return repository.findAll();
    }

    public Admin saveAdmin(Admin admin) {
        return repository.save(admin);
    }

    public Optional<Admin> getAdmin(String id) {
        return repository.findById(id);
    }

    public Admin updateAdmin(String id, Admin admin) {
        admin.setId(id);
        return repository.save(admin);
    }

    public void deleteAdmin(String id) {
        repository.deleteById(id);
    }

    public Optional<Admin> login(String email, String password) {

        Optional<Admin> admin = repository.findByEmail(email);

        if (admin.isPresent() &&
                admin.get().getPassword().equals(password)) {
            return admin;
        }

        return Optional.empty();
    }
}
