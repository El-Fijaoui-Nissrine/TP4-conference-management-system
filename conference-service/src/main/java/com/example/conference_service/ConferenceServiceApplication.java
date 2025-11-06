package com.example.conference_service;

import com.example.conference_service.dto.ConferenceDTO;
import com.example.conference_service.dto.ReviewDTO;
import com.example.conference_service.service.ConferenceService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.Date;
import java.util.List;

@SpringBootApplication
public class ConferenceServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(ConferenceServiceApplication.class, args);
	}
	@Bean
	public CommandLineRunner testConferenceService(ConferenceService conferenceService) {
		return args -> {

			ConferenceDTO conf1 = ConferenceDTO.builder()
					.titre("Spring Boot Workshop")
					.type("academique")
					.date(new Date())
					.duree(120)
					.nbInscrits(50)
					.score(4.5)
					.build();
			ConferenceDTO savConf=conferenceService.saveConference(conf1);
			ReviewDTO reviewDTO=ReviewDTO.builder()
					.date(new Date())
					.texte("Très intéressant et bien présenté !")
					.stars(3)
					.build();
			conferenceService.addReview(savConf.getId(),reviewDTO);
			ConferenceDTO conf2 = ConferenceDTO.builder()
					.titre("Spring Boot Workshop")
					.type("academique")
					.date(new Date())
					.duree(220)
					.nbInscrits(50)
					.score(2.5)
					.build();
			ConferenceDTO savConf2=conferenceService.saveConference(conf2);
			ReviewDTO reviewDTO2=ReviewDTO.builder()
					.date(new Date())
					.texte("Très intéressant !")
					.stars(4)
					.build();
			conferenceService.addReview(savConf2.getId(),reviewDTO2);
			List<ConferenceDTO> conferences = conferenceService.conferenceList();
			System.out.println("All Conferences:");
			conferences.forEach(System.out::println);
			List<ReviewDTO> reviews = conferenceService.getReviewsByConference(savConf2.getId());
			System.out.println("Reviews for Conference ID " + savConf2.getId() + ":");
			reviews.forEach(System.out::println);
		};}
}
