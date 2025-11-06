package com.example.keynote_service.service;

import com.example.keynote_service.dto.KeynoteDTO;
import com.example.keynote_service.entities.Keynote;
import com.example.keynote_service.mapper.KeynoteMapperImpl;
import com.example.keynote_service.repository.KeynoteRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Key;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Transactional
public class KeynoteServiceImpl implements KeynoteService {
private KeynoteRepository keynoteRepository;
private KeynoteMapperImpl keynoteMapper;
    @Override
    public KeynoteDTO getKeynoteById(Long id) {
        Keynote keynote=keynoteRepository.findById(id).orElse(null);
        return keynoteMapper.fromKeynote(keynote);
    }

    @Override
    public List<KeynoteDTO> listKeynotes() {
    List<Keynote> keynoteList=keynoteRepository.findAll();
    List<KeynoteDTO> keynoteDTOList=keynoteList.stream().map(k->keynoteMapper.fromKeynote(k)).collect(Collectors.toList());
        return keynoteDTOList;
    }

    @Override
    public KeynoteDTO upDateKeynotes(KeynoteDTO keynoteDTO) {
        Keynote keynote=keynoteMapper.fromKeynoteDTO(keynoteDTO);
        Keynote upKeynote=keynoteRepository.save(keynote);
        return keynoteMapper.fromKeynote(upKeynote);
    }

    @Override
    public KeynoteDTO saveKeynote(KeynoteDTO keynoteDTO) {
        Keynote keynote =keynoteMapper.fromKeynoteDTO(keynoteDTO);
        Keynote keySave=keynoteRepository.save(keynote);
        return  keynoteMapper.fromKeynote(keySave);
    }

    @Override
    public void deleteKeyote(Long id) {
        keynoteRepository.deleteById(id);

    }
}
