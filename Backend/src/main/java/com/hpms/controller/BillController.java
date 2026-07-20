package com.hpms.controller;

import com.hpms.model.Bill;
import com.hpms.service.BillService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bills")
@CrossOrigin(origins = "*")
public class BillController {

    private final BillService service;

    public BillController(BillService service) {
        this.service = service;
    }

    @PostMapping
    public Bill addBill(@RequestBody Bill bill) {
        return service.saveBill(bill);
    }

    @GetMapping
    public List<Bill> getBills() {
        return service.getAllBills();
    }

    @PutMapping("/{id}")
    public Bill updateBill(
            @PathVariable String id,
            @RequestBody Bill bill) {

        return service.updateBill(id, bill);
    }

    @DeleteMapping("/{id}")
    public void deleteBill(@PathVariable String id) {
        service.deleteBill(id);
    }
}