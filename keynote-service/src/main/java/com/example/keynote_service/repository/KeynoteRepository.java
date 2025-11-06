package com.example.keynote_service.repository;

import com.example.keynote_service.entities.Keynote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KeynoteRepository extends JpaRepository<Keynote, Long> {
}
