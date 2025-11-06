package com.example.keynote_service.web;

import com.example.keynote_service.dto.KeynoteDTO;
import com.example.keynote_service.service.KeynoteService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
public class KeynoteController {
    private KeynoteService keynoteService;
    @GetMapping("/keynotes")
    public List<KeynoteDTO> keynoteDTOList(){
        return  keynoteService.listKeynotes();
    }
    @GetMapping("/keynotes/{id}")
    public KeynoteDTO keynoteDTOById(@PathVariable Long keyid){
        return  keynoteService.getKeynoteById(keyid);
    }
@PostMapping("/keynotes")
    public KeynoteDTO addKeynote(@RequestBody KeynoteDTO keynoteDTO){
        return keynoteService.saveKeynote(keynoteDTO);
}
@PutMapping("/keynotes/{id}")
    public KeynoteDTO updateKeynote(@PathVariable Long id,@RequestBody KeynoteDTO keynoteDTO){
        keynoteDTO.setId(id);
        return  keynoteService.upDateKeynotes(keynoteDTO);
}
@DeleteMapping("/keynotes/{id}")

public  void deletKeynote(@PathVariable Long id){
        keynoteService.deleteKeyote(id);
}
}
