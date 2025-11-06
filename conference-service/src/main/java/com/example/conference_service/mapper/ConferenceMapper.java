package com.example.conference_service.mapper;

import com.example.conference_service.dto.ConferenceDTO;
import com.example.conference_service.dto.ReviewDTO;
import com.example.conference_service.entities.Conference;
import com.example.conference_service.entities.Review;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

@Service
public class ConferenceMapper {
    public ConferenceDTO fromconference(Conference conference){
        ConferenceDTO conferenceDTO=new ConferenceDTO();
        BeanUtils.copyProperties(conference,conferenceDTO);
        return conferenceDTO;
    }
    public Conference fromconferenceDTO(ConferenceDTO conferenceDTO){
        Conference conference=new Conference();
        BeanUtils.copyProperties(conferenceDTO,conference);
        return conference;
    }
    public ReviewDTO fromReview(Review review){
        ReviewDTO rDTO=new ReviewDTO();
        BeanUtils.copyProperties(review,rDTO);
        return rDTO;
    }
    public Review fromReviewDTO(ReviewDTO reviewDTO){
        Review review=new Review();
        BeanUtils.copyProperties(reviewDTO,review);
        return review;
    }
}
