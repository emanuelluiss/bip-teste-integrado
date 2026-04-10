package com.example.backend.service;

import com.example.backend.dto.BeneficioRequest;
import com.example.backend.dto.BeneficioResponse;
import com.example.backend.dto.TransferenciaRequest;
import com.example.backend.exception.BeneficioNotFoundException;
import com.example.backend.exception.SaldoInsuficienteException;
import com.example.backend.repository.BeneficioRepository;
import com.example.ejb.Beneficio;
import com.example.ejb.BeneficioEjbService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BeneficioServiceTest {

    @Mock
    private BeneficioRepository repository;

    @Mock
    private BeneficioEjbService ejbService;

    @InjectMocks
    private BeneficioService service;

    private Beneficio beneficioA;
    private Beneficio beneficioB;

    @BeforeEach
    void setUp() {
        beneficioA = new Beneficio("Alimentação", "Vale alimentação", new BigDecimal("1000.00"));
        beneficioB = new Beneficio("Transporte",  "Vale transporte",  new BigDecimal("500.00"));
    }

    // ── listar ────────────────────────────────────────────────────────────────

    @Test
    @DisplayName("listar() retorna todos os benefícios mapeados para DTO")
    void listar_retornaLista() {
        when(repository.findAll()).thenReturn(List.of(beneficioA, beneficioB));

        List<BeneficioResponse> result = service.listar();

        assertThat(result).hasSize(2);
        assertThat(result).extracting(BeneficioResponse::getNome)
                          .containsExactly("Alimentação", "Transporte");
    }

    @Test
    @DisplayName("listar() retorna lista vazia quando não há registros")
    void listar_vazio() {
        when(repository.findAll()).thenReturn(List.of());

        assertThat(service.listar()).isEmpty();
    }

    // ── buscar ────────────────────────────────────────────────────────────────

    @Test
    @DisplayName("buscar() retorna DTO quando benefício existe")
    void buscar_encontrado() {
        when(repository.findById(1L)).thenReturn(Optional.of(beneficioA));

        BeneficioResponse resp = service.buscar(1L);

        assertThat(resp.getNome()).isEqualTo("Alimentação");
        assertThat(resp.getValor()).isEqualByComparingTo("1000.00");
    }

    @Test
    @DisplayName("buscar() lança BeneficioNotFoundException para ID inexistente")
    void buscar_naoEncontrado() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.buscar(99L))
            .isInstanceOf(BeneficioNotFoundException.class)
            .hasMessageContaining("99");
    }

    // ── criar ─────────────────────────────────────────────────────────────────

    @Test
    @DisplayName("criar() persiste e retorna o benefício criado")
    void criar_sucesso() {
        when(repository.save(any(Beneficio.class))).thenReturn(beneficioA);

        BeneficioRequest req = buildRequest("Alimentação", "Desc", "1000.00", true);
        BeneficioResponse resp = service.criar(req);

        assertThat(resp.getNome()).isEqualTo("Alimentação");
        verify(repository).save(any(Beneficio.class));
    }

    @Test
    @DisplayName("criar() respeita o campo ativo quando fornecido como false")
    void criar_atoFalse() {
        Beneficio inativo = new Beneficio("Inativo", null, new BigDecimal("100.00"));
        inativo.setAtivo(false);
        when(repository.save(any(Beneficio.class))).thenReturn(inativo);

        BeneficioRequest req = buildRequest("Inativo", null, "100.00", false);
        service.criar(req);

        verify(repository).save(argThat(b -> Boolean.FALSE.equals(b.getAtivo())));
    }

    // ── atualizar ─────────────────────────────────────────────────────────────

    @Test
    @DisplayName("atualizar() altera campos e retorna DTO atualizado")
    void atualizar_sucesso() {
        when(repository.findById(1L)).thenReturn(Optional.of(beneficioA));
        when(repository.save(any(Beneficio.class))).thenReturn(beneficioA);

        BeneficioRequest req = buildRequest("Novo Nome", "Nova desc", "1500.00", true);
        service.atualizar(1L, req);

        verify(repository).save(argThat(b ->
            "Novo Nome".equals(b.getNome()) &&
            b.getValor().compareTo(new BigDecimal("1500.00")) == 0
        ));
    }

    @Test
    @DisplayName("atualizar() lança BeneficioNotFoundException para ID inexistente")
    void atualizar_naoEncontrado() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        BeneficioRequest req = buildRequest("X", null, "1.00", true);
        assertThatThrownBy(() -> service.atualizar(99L, req))
            .isInstanceOf(BeneficioNotFoundException.class);
    }

    // ── deletar ───────────────────────────────────────────────────────────────

    @Test
    @DisplayName("deletar() chama deleteById quando benefício existe")
    void deletar_sucesso() {
        when(repository.findById(1L)).thenReturn(Optional.of(beneficioA));

        service.deletar(1L);

        verify(repository).deleteById(1L);
    }

    @Test
    @DisplayName("deletar() lança BeneficioNotFoundException para ID inexistente")
    void deletar_naoEncontrado() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.deletar(99L))
            .isInstanceOf(BeneficioNotFoundException.class);
        verify(repository, never()).deleteById(any());
    }

    // ── transferir (delegado ao BeneficioEjbService) ─────────────────────────

    @Test
    @DisplayName("transferir() delega a chamada ao ejbService.transfer()")
    void transferir_delegaAoEjb() {
        TransferenciaRequest req = buildTransferencia(1L, 2L, "300.00");
        service.transferir(req);

        verify(ejbService).transfer(1L, 2L, new BigDecimal("300.00"));
    }

    @Test
    @DisplayName("transferir() lança IllegalArgumentException quando fromId == toId (via EJB)")
    void transferir_mesmoId() {
        doThrow(new IllegalArgumentException("fromId e toId não podem ser iguais."))
            .when(ejbService).transfer(1L, 1L, new BigDecimal("100.00"));

        TransferenciaRequest req = buildTransferencia(1L, 1L, "100.00");

        assertThatThrownBy(() -> service.transferir(req))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("não podem ser iguais");
    }

    @Test
    @DisplayName("transferir() converte IllegalStateException de saldo insuficiente em SaldoInsuficienteException")
    void transferir_saldoInsuficiente() {
        doThrow(new IllegalStateException("Saldo insuficiente no benefício de origem (id=1). Disponível: 1000.00, Solicitado: 9999.00"))
            .when(ejbService).transfer(1L, 2L, new BigDecimal("9999.00"));

        TransferenciaRequest req = buildTransferencia(1L, 2L, "9999.00");

        assertThatThrownBy(() -> service.transferir(req))
            .isInstanceOf(SaldoInsuficienteException.class)
            .hasMessageContaining("id=1");
    }

    @Test
    @DisplayName("transferir() converte IllegalStateException de origem não encontrada em BeneficioNotFoundException")
    void transferir_origemNaoEncontrada() {
        doThrow(new IllegalStateException("Benefício de origem não encontrado: id=99"))
            .when(ejbService).transfer(99L, 2L, new BigDecimal("100.00"));

        TransferenciaRequest req = buildTransferencia(99L, 2L, "100.00");

        assertThatThrownBy(() -> service.transferir(req))
            .isInstanceOf(BeneficioNotFoundException.class)
            .hasMessageContaining("99");
    }

    @Test
    @DisplayName("transferir() converte IllegalStateException de destino não encontrado em BeneficioNotFoundException")
    void transferir_destinoNaoEncontrado() {
        doThrow(new IllegalStateException("Benefício de destino não encontrado: id=99"))
            .when(ejbService).transfer(1L, 99L, new BigDecimal("100.00"));

        TransferenciaRequest req = buildTransferencia(1L, 99L, "100.00");

        assertThatThrownBy(() -> service.transferir(req))
            .isInstanceOf(BeneficioNotFoundException.class)
            .hasMessageContaining("99");
    }

    // ── helpers ───────────────────────────────────────────────────────────────

    private BeneficioRequest buildRequest(String nome, String desc, String valor, boolean ativo) {
        BeneficioRequest r = new BeneficioRequest();
        r.setNome(nome);
        r.setDescricao(desc);
        r.setValor(new BigDecimal(valor));
        r.setAtivo(ativo);
        return r;
    }

    private TransferenciaRequest buildTransferencia(Long from, Long to, String valor) {
        TransferenciaRequest r = new TransferenciaRequest();
        r.setFromId(from);
        r.setToId(to);
        r.setValor(new BigDecimal(valor));
        return r;
    }
}
