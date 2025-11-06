package com.example.keynote_service.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor @NoArgsConstructor @Builder
@Entity
public class Keynote {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  Long id ;
    private  String nom;
    private  String prenom;
    private String email;
    private String fonction;

}
