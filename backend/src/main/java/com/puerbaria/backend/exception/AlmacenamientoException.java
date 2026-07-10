package com.puerbaria.backend.exception;

public class AlmacenamientoException extends RuntimeException {

    public AlmacenamientoException(String mensaje, Throwable causa) {
        super(mensaje, causa);
    }
}
