package com.example.backend.exception;

import java.math.BigDecimal;

public class SaldoInsuficienteException extends RuntimeException {

    public SaldoInsuficienteException(Long id, BigDecimal disponivel, BigDecimal solicitado) {
        super(String.format(
            "Saldo insuficiente no benefício id=%d. Disponível: %s, Solicitado: %s",
            id, disponivel, solicitado));
    }
}
