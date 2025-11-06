package com.example.conference_service.repository;

import com.example.conference_service.entities.Conference;
import com.example.conference_service.entities.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository

public interface ReviewRepository extends JpaRepository<Review,Long> {
}
