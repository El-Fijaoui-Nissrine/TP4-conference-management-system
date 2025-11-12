package com.example.conference_service.feign;

import com.example.conference_service.model.KeynoteDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.hateoas.PagedModel;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "keynote-service", url = "http://localhost:8085")
public interface KeynoteRestClient {
    @GetMapping("/api/keynotes")
    List<KeynoteDTO> getAllKeynotes();
    @GetMapping("/api/keynotes/{id}")
    KeynoteDTO getKeynoteById(@PathVariable Long id);

}
