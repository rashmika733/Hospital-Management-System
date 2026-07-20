package com.hpms.repository;

import com.hpms.model.Bill;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BillRepository
        extends MongoRepository<Bill, String> {
}