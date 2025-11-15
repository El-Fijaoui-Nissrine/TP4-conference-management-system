package com.example.conference_service.web;

import com.example.conference_service.dto.ConferenceDTO;
import com.example.conference_service.dto.ReviewDTO;
import com.example.conference_service.model.KeynoteDTO;
import com.example.conference_service.service.ConferenceService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/conferences")

public class ConferenceController {
    private ConferenceService conferenceService;


    @GetMapping
    public List<ConferenceDTO> listConferences() {
        return conferenceService.conferenceList();
    }

    @GetMapping("/{id}")
    public ConferenceDTO getConference(@PathVariable Long id) {
        return conferenceService.getConference(id);
    }

    @PostMapping
    public ConferenceDTO createConference(@RequestBody ConferenceDTO conferenceDTO) {
        return conferenceService.saveConference(conferenceDTO);
    }
    @PutMapping("/{id}")
    public ConferenceDTO updateConference(@PathVariable Long id, @RequestBody ConferenceDTO conferenceDTO) {
        conferenceDTO.setId(id);
        return conferenceService.upDateConference(conferenceDTO);
    }
    @DeleteMapping("/{id}")
    public void deleteConference(@PathVariable Long id) {
        conferenceService.deleteConference(id);
    }
    @GetMapping("/{id}/reviews")
    public List<ReviewDTO> getReviewsByConference(@PathVariable Long id) {
        return conferenceService.getReviewsByConference(id);
    }
    @GetMapping("/{id}/keynotes")
    public List<KeynoteDTO> getKeynotesByConference(@PathVariable Long id) {
        return conferenceService.allKeynotesByIDconf(id);
    }
    @PostMapping("/{id}/reviews")
    public ReviewDTO addReview(@PathVariable Long id, @RequestBody ReviewDTO reviewDTO) {
        return conferenceService.addReview(id, reviewDTO);
    }

}
