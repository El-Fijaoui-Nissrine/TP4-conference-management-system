package com.example.conference_service.entities;

import com.example.conference_service.model.KeynoteDTO;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class Conference {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String titre;
    private String type; // "academique" or "commerciale"
    private Date date;
    private Integer duree; // minutes
    private Integer nbInscrits;
    private Double score;
    @OneToMany(mappedBy = "conference")
    private List<Review> reviews = new ArrayList<>();
    @ElementCollection
    @CollectionTable(name = "conference_keynotes", joinColumns = @JoinColumn(name = "conference_id"))
    @Column(name = "keynote_id")
    private List<Long> keynoteIds = new ArrayList<>();

    @Transient private List<KeynoteDTO> keynotes= new ArrayList<>();
}
