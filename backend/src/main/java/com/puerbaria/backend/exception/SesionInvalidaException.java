package com.puerbaria.backend.exception;

public class SesionInvalidaException extends RuntimeException {

    public SesionInvalidaException(String mensaje) {
        super(mensaje);
    }
}
