package com.example.conference_service.service;

import com.example.conference_service.dto.ConferenceDTO;
import com.example.conference_service.dto.ReviewDTO;
import com.example.conference_service.entities.Conference;
import com.example.conference_service.entities.Review;
import com.example.conference_service.feign.KeynoteRestClient;
import com.example.conference_service.mapper.ConferenceMapper;
import com.example.conference_service.model.KeynoteDTO;
import com.example.conference_service.repository.ConferenceRepository;
import com.example.conference_service.repository.ReviewRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Transactional
public class ConferenceServiceImpl implements ConferenceService{
    private ConferenceMapper conferenceMapper;
    private ConferenceRepository conferenceRepository;
    private ReviewRepository repository;
    private KeynoteRestClient keynoteRestClient;
    @Override
    public List<ConferenceDTO> conferenceList() {
        return conferenceRepository.findAll()
                .stream()
                .map(conferenceMapper::fromconference)
                .collect(Collectors.toList());
    }

    @Override
    public ConferenceDTO getConference(Long id) {
        Conference conference = conferenceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Conference not found with id: " + id));
        return conferenceMapper.fromconference(conference);
    }

    @Override
    public ConferenceDTO saveConference(ConferenceDTO conferenceDTO) {
        Conference conference = conferenceMapper.fromconferenceDTO(conferenceDTO);
        Conference savedConference = conferenceRepository.save(conference);
        return conferenceMapper.fromconference(savedConference);
    }

    @Override
    public ConferenceDTO upDateConference(ConferenceDTO conferenceDTO) {
        Conference conference = conferenceMapper.fromconferenceDTO(conferenceDTO);
        Conference savedConference = conferenceRepository.save(conference);
        return conferenceMapper.fromconference(savedConference);
    }

    @Override
    public void deleteConference(Long id) {
        if (!conferenceRepository.existsById(id)) {
            throw new RuntimeException("Conference not found with id: " + id);
        }
        conferenceRepository.deleteById(id);

    }

    @Override
    public List<ReviewDTO> getReviewsByConference(Long idConf) {
        Conference conference = conferenceRepository.findById(idConf)
                .orElseThrow(() -> new RuntimeException("Conference not found with id: " + idConf));
        List<ReviewDTO> reviewDTOList=conference.getReviews().stream().map(r->conferenceMapper.fromReview(r)).collect(Collectors.toList());
        return reviewDTOList;
    }

    @Override
    public ReviewDTO addReview(Long conferenceId, ReviewDTO reviewDTO) {
        Conference conference = conferenceRepository.findById(conferenceId)
                .orElseThrow(() -> new RuntimeException("Conference not found with id: " + conferenceId));

        Review review = conferenceMapper.fromReviewDTO(reviewDTO);
        review.setConference(conference);

        Review savedReview = repository.save(review);
        return conferenceMapper.fromReview(savedReview);
    }

    @Override
    public List<KeynoteDTO> allKeynotesByIDconf(Long confId) {
        // Récupérer la conférence
        Conference conference = conferenceRepository.findById(confId)
                .orElseThrow(() -> new RuntimeException("Conference not found with id: " + confId));

        // Récupérer tous les keynotes disponibles
        List<KeynoteDTO> allKeynotes = keynoteRestClient.getAllKeynotes();

        // Filtrer pour garder seulement les keynotes associés à cette conférence
        List<KeynoteDTO> conferenceKeynotes = allKeynotes.stream()
                .filter(keynote -> conference.getKeynoteIds().contains(keynote.getId()))
                .collect(Collectors.toList());

        return conferenceKeynotes;
    }
}
