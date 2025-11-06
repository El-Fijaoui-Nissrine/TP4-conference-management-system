package com.example.conference_service.dto;

import com.example.conference_service.entities.Review;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ConferenceDTO {
    private Long id;
    private String titre;
    private String type; // "academique" or "commerciale"
    private Date date;
    private Integer duree; // minutes
    private Integer nbInscrits;
    private Double score;
}
