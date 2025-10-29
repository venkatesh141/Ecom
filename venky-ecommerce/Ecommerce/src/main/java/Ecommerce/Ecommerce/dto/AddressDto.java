package Ecommerce.Ecommerce.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
//When Jackson converts your object into JSON, it will skip any fields that are null.
@JsonInclude(JsonInclude.Include.NON_NULL)
/*
When Jackson reads JSON (deserialization), if the JSON has some extra fields that don’t exist in your class, it will just ignore them instead of throwing an error.*/
@JsonIgnoreProperties(ignoreUnknown = true)
@AllArgsConstructor
@NoArgsConstructor
public class AddressDto {

    private Long id;

    private String street;
    private String city;
    private String state;
    private String zipCode;
    private String country;

    private UserDto user;

    private  LocalDateTime createdAt;
}