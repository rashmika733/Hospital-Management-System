package com.hpms.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "patients")
public class Patient {

    @Id
    private String id;

    private String patientId;
    private String patientName;
    private int age;
    private String gender;
    private String phoneNumber;
    private String address;

    public Patient() {
    }

    public Patient(String patientName,int age, String gender, String phoneNumber,String address) {

        this.patientName = patientName;
        this.age = age;
        this.gender = gender;
        this.phoneNumber = phoneNumber;
        this.address = address;
    }

    // MongoDB _id
    public String getId() {

        return id;
    }

    public void setId(String id) {

        this.id = id;
    }

    // Custom Patient ID (P001, P002...)
    public String getPatientId() {

        return patientId;
    }

    public void setPatientId(String patientId) {

        this.patientId = patientId;
    }

    public String getPatientName() {

        return patientName;
    }

    public void setPatientName(String patientName) {

        this.patientName = patientName;
    }

    public int getAge() {

        return age;
    }

    public void setAge(int age) {

        this.age = age;
    }

    public String getGender() {

        return gender;
    }

    public void setGender(String gender) {

        this.gender = gender;
    }

    public String getPhoneNumber() {

        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {

        this.phoneNumber = phoneNumber;
    }

    public String getAddress() {

        return address;
    }

    public void setAddress(String address) {

        this.address = address;
    }
}