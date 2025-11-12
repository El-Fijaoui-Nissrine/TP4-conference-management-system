package com.example.conference_service.dto;

import com.example.conference_service.entities.Review;
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
public class ConferenceDTO {
    private Long id;
    private String titre;
    private String type; // "academique" or "commerciale"
    private Date date;
    private Integer duree; // minutes
    private Integer nbInscrits;
    private Double score;
    private List<Long> keynoteIds = new ArrayList<>();
    @Override
    public String toString() {
        return "ConferenceDTO{" +
                "id=" + id +
                ", titre='" + titre + '\'' +
                ", type='" + type + '\'' +
                ", date=" + date +
                ", duree=" + duree +
                ", nbInscrits=" + nbInscrits +
                ", score=" + score +
                '}';
    }

}
