package com.example.conference_service.service;

import com.example.conference_service.dto.ConferenceDTO;
import com.example.conference_service.dto.ReviewDTO;

import java.util.List;

public interface ConferenceService {
    List<ConferenceDTO> conferenceList();
    ConferenceDTO getConference(Long id);
    ConferenceDTO saveConference(ConferenceDTO conferenceDTO);
    ConferenceDTO upDateConference(ConferenceDTO conferenceDTO);
    void deleteConference(Long id);
List<ReviewDTO> getReviewsByConference(Long idConf);
    ReviewDTO addReview(Long conferenceId, ReviewDTO review);

}
