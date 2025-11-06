package com.example.keynote_service;

import com.example.keynote_service.dto.KeynoteDTO;
import com.example.keynote_service.repository.KeynoteRepository;
import com.example.keynote_service.service.KeynoteService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.stream.Stream;

@SpringBootApplication
public class KeynoteServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(KeynoteServiceApplication.class, args);
	}
	@Bean
	CommandLineRunner start(KeynoteService keynoteService){
		return atgs->{
			Stream.of("Amine","Zienb","Niisrine").forEach(name->{
				KeynoteDTO keynoteDTO=new KeynoteDTO();
				keynoteDTO.setNom(name);
				keynoteDTO.setPrenom("Al "+name);
				keynoteDTO.setEmail(name+keynoteDTO.getPrenom()+"@gmail.com");
				keynoteDTO.setFonction("Chercheuse");
				keynoteService.saveKeynote(keynoteDTO);

			});
			Stream.of("Aziz","Malak","Ali").forEach(name->{
				KeynoteDTO keynoteDTO=new KeynoteDTO();
				keynoteDTO.setNom(name);
				keynoteDTO.setPrenom("El "+name);
				keynoteDTO.setEmail(name+keynoteDTO.getPrenom()+"@gmail.com");
				keynoteDTO.setFonction("Professeur");
				keynoteService.saveKeynote(keynoteDTO);

			});
keynoteService.listKeynotes().forEach(k->{
	System.out.println("===========");
	System.out.println(k.getId());
	System.out.println(k.getNom());
	System.out.println(k.getEmail());
	System.out.println(k.getFonction());
	System.out.println("===========");
});
			};



		}


	}

