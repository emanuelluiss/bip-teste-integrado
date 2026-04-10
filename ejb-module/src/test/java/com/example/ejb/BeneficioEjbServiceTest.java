package com.example.ejb;

import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BeneficioEjbServiceTest {

    @Mock
    private EntityManager em;

    @InjectMocks
    private BeneficioEjbService service;

    private Beneficio origem;
    private Beneficio destino;

    @BeforeEach
    void setUp() {
        origem  = new Beneficio("Alimentação", "Desc", new BigDecimal("1000.00"));
        destino = new Beneficio("Transporte",  "Desc", new BigDecimal("500.00"));
    }

    // ── transferência bem-sucedida ─────────────────────────────────────────────

    @Test
    @DisplayName("transfer() debita origem e credita destino corretamente")
    void transfer_sucesso() {
        when(em.find(Beneficio.class, 1L, LockModeType.OPTIMISTIC_FORCE_INCREMENT)).thenReturn(origem);
        when(em.find(Beneficio.class, 2L, LockModeType.OPTIMISTIC_FORCE_INCREMENT)).thenReturn(destino);

        service.transfer(1L, 2L, new BigDecimal("300.00"));

        assertThat(origem.getValor()).isEqualByComparingTo("700.00");
        assertThat(destino.getValor()).isEqualByComparingTo("800.00");
    }

    @Test
    @DisplayName("transfer() usa OPTIMISTIC_FORCE_INCREMENT nos dois registros")
    void transfer_usaLockingOtimista() {
        when(em.find(Beneficio.class, 1L, LockModeType.OPTIMISTIC_FORCE_INCREMENT)).thenReturn(origem);
        when(em.find(Beneficio.class, 2L, LockModeType.OPTIMISTIC_FORCE_INCREMENT)).thenReturn(destino);

        service.transfer(1L, 2L, new BigDecimal("100.00"));

        verify(em).find(Beneficio.class, 1L, LockModeType.OPTIMISTIC_FORCE_INCREMENT);
        verify(em).find(Beneficio.class, 2L, LockModeType.OPTIMISTIC_FORCE_INCREMENT);
    }

    // ── validações de argumento ───────────────────────────────────────────────

    @Test
    @DisplayName("transfer() lança IllegalArgumentException quando fromId é nulo")
    void transfer_fromIdNulo() {
        assertThatThrownBy(() -> service.transfer(null, 2L, new BigDecimal("100.00")))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("nulos");
    }

    @Test
    @DisplayName("transfer() lança IllegalArgumentException quando toId é nulo")
    void transfer_toIdNulo() {
        assertThatThrownBy(() -> service.transfer(1L, null, new BigDecimal("100.00")))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("nulos");
    }

    @Test
    @DisplayName("transfer() lança IllegalArgumentException quando fromId == toId")
    void transfer_mesmoId() {
        assertThatThrownBy(() -> service.transfer(1L, 1L, new BigDecimal("100.00")))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("não podem ser iguais");
    }

    @Test
    @DisplayName("transfer() lança IllegalArgumentException quando amount é zero")
    void transfer_valorZero() {
        assertThatThrownBy(() -> service.transfer(1L, 2L, BigDecimal.ZERO))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("positivo");
    }

    @Test
    @DisplayName("transfer() lança IllegalArgumentException quando amount é negativo")
    void transfer_valorNegativo() {
        assertThatThrownBy(() -> service.transfer(1L, 2L, new BigDecimal("-50.00")))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("positivo");
    }

    @Test
    @DisplayName("transfer() lança IllegalArgumentException quando amount é nulo")
    void transfer_valorNulo() {
        assertThatThrownBy(() -> service.transfer(1L, 2L, null))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("positivo");
    }

    // ── entidade não encontrada ───────────────────────────────────────────────

    @Test
    @DisplayName("transfer() lança IllegalStateException quando origem não existe")
    void transfer_origemNaoEncontrada() {
        when(em.find(Beneficio.class, 99L, LockModeType.OPTIMISTIC_FORCE_INCREMENT)).thenReturn(null);
        when(em.find(Beneficio.class, 2L,  LockModeType.OPTIMISTIC_FORCE_INCREMENT)).thenReturn(destino);

        assertThatThrownBy(() -> service.transfer(99L, 2L, new BigDecimal("100.00")))
            .isInstanceOf(IllegalStateException.class)
            .hasMessageContaining("origem")
            .hasMessageContaining("99");
    }

    @Test
    @DisplayName("transfer() lança IllegalStateException quando destino não existe")
    void transfer_destinoNaoEncontrado() {
        when(em.find(Beneficio.class, 1L,  LockModeType.OPTIMISTIC_FORCE_INCREMENT)).thenReturn(origem);
        when(em.find(Beneficio.class, 99L, LockModeType.OPTIMISTIC_FORCE_INCREMENT)).thenReturn(null);

        assertThatThrownBy(() -> service.transfer(1L, 99L, new BigDecimal("100.00")))
            .isInstanceOf(IllegalStateException.class)
            .hasMessageContaining("destino")
            .hasMessageContaining("99");
    }

    // ── saldo insuficiente ────────────────────────────────────────────────────

    @Test
    @DisplayName("transfer() lança IllegalStateException quando saldo é insuficiente")
    void transfer_saldoInsuficiente() {
        when(em.find(Beneficio.class, 1L, LockModeType.OPTIMISTIC_FORCE_INCREMENT)).thenReturn(origem);
        when(em.find(Beneficio.class, 2L, LockModeType.OPTIMISTIC_FORCE_INCREMENT)).thenReturn(destino);

        assertThatThrownBy(() -> service.transfer(1L, 2L, new BigDecimal("9999.00")))
            .isInstanceOf(IllegalStateException.class)
            .hasMessageContaining("Saldo insuficiente")
            .hasMessageContaining("id=1");
    }

    @Test
    @DisplayName("transfer() lança IllegalStateException quando valor exatamente igual ao saldo")
    void transfer_valorExatoDoSaldo() {
        when(em.find(Beneficio.class, 1L, LockModeType.OPTIMISTIC_FORCE_INCREMENT)).thenReturn(origem);
        when(em.find(Beneficio.class, 2L, LockModeType.OPTIMISTIC_FORCE_INCREMENT)).thenReturn(destino);

        // Transferir exatamente o saldo disponível deve ser permitido
        service.transfer(1L, 2L, new BigDecimal("1000.00"));

        assertThat(origem.getValor()).isEqualByComparingTo("0.00");
        assertThat(destino.getValor()).isEqualByComparingTo("1500.00");
    }
}
