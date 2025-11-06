package com.example.conference_service.repository;

import com.example.conference_service.entities.Conference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository

public interface ConferenceRepository extends JpaRepository<Conference,Long> {
}
