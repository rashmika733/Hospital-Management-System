package com.hpms.service;

import com.hpms.model.Bill;
import com.hpms.repository.BillRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BillService {

    private final BillRepository repository;

    public BillService(BillRepository repository) {
        this.repository = repository;
    }

    // Add bill
    public Bill saveBill(Bill bill) {

        double total =
                bill.getDoctorFee()
                        + bill.getMedicineFee()
                        + bill.getOtherFee();

        bill.setTotalAmount(total);

        Bill savedBill = repository.save(bill);

        System.out.println("Saved Bill = " + savedBill);

        return savedBill;
    }

    // Get all bills
    public List<Bill> getAllBills() {
        return repository.findAll();
    }

    // Update bill
    public Bill updateBill(String id, Bill bill) {

        bill.setId(id);

        double total;
        total = bill.getDoctorFee()
                + bill.getMedicineFee()
                + bill.getOtherFee();

        bill.setTotalAmount(total);

        return repository.save(bill);
    }

    // Delete bill
    public void deleteBill(String id) {
        repository.deleteById(id);
    }
}