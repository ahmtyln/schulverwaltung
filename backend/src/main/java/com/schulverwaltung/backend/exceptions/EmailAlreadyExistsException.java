package com.schulverwaltung.backend.exceptions;

public class EmailAlreadyExistsException  extends RuntimeException{
    public EmailAlreadyExistsException(String message){
        super(message);
    }
}
