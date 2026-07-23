package com.hpms.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "doctors")
public class Doctor {

    @Id
    private String id;

    private String doctorId;
    private String name;
    private String specialization;
    private String phone;
    private String email;
    private String room;

    public Doctor() {
    }

    public String getId() {

        return id;
    }

    public void setId(String id) {

        this.id = id;
    }

    public String getDoctorId() {

        return doctorId;
    }

    public void setDoctorId(String doctorId) {

        this.doctorId = doctorId;
    }

    public String getName() {

        return name;
    }

    public void setName(String name) {

        this.name = name;
    }

    public String getSpecialization() {

        return specialization;
    }

    public void setSpecialization(String specialization) {

        this.specialization = specialization;
    }

    public String getPhone() {

        return phone;
    }

    public void setPhone(String phone) {

        this.phone = phone;
    }

    public String getEmail() {

        return email;
    }

    public void setEmail(String email) {

        this.email = email;
    }

    public String getRoom() {

        return room;
    }

    public void setRoom(String room) {
        
        this.room = room;
    }
}