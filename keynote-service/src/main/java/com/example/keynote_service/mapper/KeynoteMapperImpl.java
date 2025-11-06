package com.example.keynote_service.mapper;

import com.example.keynote_service.dto.KeynoteDTO;
import com.example.keynote_service.entities.Keynote;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

@Service

public class KeynoteMapperImpl {
    public KeynoteDTO fromKeynote(Keynote keynote){
        KeynoteDTO keynoteDTO=new KeynoteDTO();
        BeanUtils.copyProperties(keynote,keynoteDTO);
        return keynoteDTO;
    }
    public Keynote fromKeynoteDTO(KeynoteDTO keynoteDTO){
        Keynote keynote=new Keynote();
        BeanUtils.copyProperties(keynoteDTO,keynote);
        return keynote;
    }
}
