package com.example.keynote_service.service;

import com.example.keynote_service.dto.KeynoteDTO;
import org.springframework.stereotype.Service;

import java.util.List;


public interface KeynoteService {
KeynoteDTO getKeynoteById(Long id);
List<KeynoteDTO> listKeynotes();
KeynoteDTO upDateKeynotes(KeynoteDTO keynoteDTO);
KeynoteDTO saveKeynote(KeynoteDTO keynoteDTO);
void deleteKeyote(Long id);

}
