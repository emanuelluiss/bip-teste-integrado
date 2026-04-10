package com.example.backend.controller;

import com.example.backend.dto.BeneficioRequest;
import com.example.backend.dto.BeneficioResponse;
import com.example.backend.dto.TransferenciaRequest;
import com.example.backend.exception.BeneficioNotFoundException;
import com.example.backend.exception.GlobalExceptionHandler;
import com.example.backend.exception.SaldoInsuficienteException;
import com.example.backend.service.BeneficioService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class BeneficioControllerTest {

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @Mock
    private BeneficioService service;

    @InjectMocks
    private BeneficioController controller;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
            .standaloneSetup(controller)
            .setControllerAdvice(new GlobalExceptionHandler())
            .build();
        objectMapper = new ObjectMapper();
    }

    // ── GET /api/v1/beneficios ────────────────────────────────────────────────

    @Test
    @DisplayName("GET /beneficios retorna 200 e lista")
    void listar_200() throws Exception {
        when(service.listar()).thenReturn(List.of(
            buildResponse(1L, "Alimentação", "1000.00", true),
            buildResponse(2L, "Transporte",  "500.00",  true)
        ));

        mockMvc.perform(get("/api/v1/beneficios"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(2)))
            .andExpect(jsonPath("$[0].nome", is("Alimentação")))
            .andExpect(jsonPath("$[1].nome", is("Transporte")));
    }

    @Test
    @DisplayName("GET /beneficios retorna 200 com lista vazia")
    void listar_vazio() throws Exception {
        when(service.listar()).thenReturn(List.of());

        mockMvc.perform(get("/api/v1/beneficios"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(0)));
    }

    // ── GET /api/v1/beneficios/{id} ───────────────────────────────────────────

    @Test
    @DisplayName("GET /beneficios/1 retorna 200 e DTO")
    void buscar_200() throws Exception {
        when(service.buscar(1L)).thenReturn(buildResponse(1L, "Alimentação", "1000.00", true));

        mockMvc.perform(get("/api/v1/beneficios/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id", is(1)))
            .andExpect(jsonPath("$.nome", is("Alimentação")))
            .andExpect(jsonPath("$.valor", is(1000.00)));
    }

    @Test
    @DisplayName("GET /beneficios/99 retorna 404 quando não encontrado")
    void buscar_404() throws Exception {
        when(service.buscar(99L)).thenThrow(new BeneficioNotFoundException(99L));

        mockMvc.perform(get("/api/v1/beneficios/99"))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.message", containsString("99")));
    }

    // ── POST /api/v1/beneficios ───────────────────────────────────────────────

    @Test
    @DisplayName("POST /beneficios retorna 201 e DTO criado")
    void criar_201() throws Exception {
        when(service.criar(any())).thenReturn(buildResponse(1L, "Novo", "200.00", true));

        BeneficioRequest req = buildRequest("Novo", "Desc", "200.00", true);

        mockMvc.perform(post("/api/v1/beneficios")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.nome", is("Novo")));
    }

    @Test
    @DisplayName("POST /beneficios retorna 400 quando nome está em branco")
    void criar_400_nomeVazio() throws Exception {
        BeneficioRequest req = buildRequest("", "Desc", "200.00", true);

        mockMvc.perform(post("/api/v1/beneficios")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message", containsString("nome")));
    }

    @Test
    @DisplayName("POST /beneficios retorna 400 quando valor é nulo")
    void criar_400_valorNulo() throws Exception {
        BeneficioRequest req = buildRequest("Nome", "Desc", null, true);

        mockMvc.perform(post("/api/v1/beneficios")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /beneficios retorna 400 quando valor é zero")
    void criar_400_valorZero() throws Exception {
        BeneficioRequest req = buildRequest("Nome", "Desc", "0.00", true);

        mockMvc.perform(post("/api/v1/beneficios")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isBadRequest());
    }

    // ── PUT /api/v1/beneficios/{id} ───────────────────────────────────────────

    @Test
    @DisplayName("PUT /beneficios/1 retorna 200 e DTO atualizado")
    void atualizar_200() throws Exception {
        when(service.atualizar(eq(1L), any())).thenReturn(buildResponse(1L, "Atualizado", "1500.00", true));

        BeneficioRequest req = buildRequest("Atualizado", "Desc", "1500.00", true);

        mockMvc.perform(put("/api/v1/beneficios/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.nome", is("Atualizado")));
    }

    @Test
    @DisplayName("PUT /beneficios/99 retorna 404 quando não encontrado")
    void atualizar_404() throws Exception {
        when(service.atualizar(eq(99L), any())).thenThrow(new BeneficioNotFoundException(99L));

        BeneficioRequest req = buildRequest("X", null, "1.00", true);

        mockMvc.perform(put("/api/v1/beneficios/99")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isNotFound());
    }

    // ── DELETE /api/v1/beneficios/{id} ────────────────────────────────────────

    @Test
    @DisplayName("DELETE /beneficios/1 retorna 204")
    void deletar_204() throws Exception {
        doNothing().when(service).deletar(1L);

        mockMvc.perform(delete("/api/v1/beneficios/1"))
            .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("DELETE /beneficios/99 retorna 404 quando não encontrado")
    void deletar_404() throws Exception {
        doThrow(new BeneficioNotFoundException(99L)).when(service).deletar(99L);

        mockMvc.perform(delete("/api/v1/beneficios/99"))
            .andExpect(status().isNotFound());
    }

    // ── POST /api/v1/beneficios/transferencia ─────────────────────────────────

    @Test
    @DisplayName("POST /transferencia retorna 204 em caso de sucesso")
    void transferir_204() throws Exception {
        doNothing().when(service).transferir(any());

        TransferenciaRequest req = buildTransferencia(1L, 2L, "300.00");

        mockMvc.perform(post("/api/v1/beneficios/transferencia")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("POST /transferencia retorna 422 para saldo insuficiente")
    void transferir_422_saldoInsuficiente() throws Exception {
        doThrow(new SaldoInsuficienteException(1L, new BigDecimal("100.00"), new BigDecimal("9999.00")))
            .when(service).transferir(any());

        TransferenciaRequest req = buildTransferencia(1L, 2L, "9999.00");

        mockMvc.perform(post("/api/v1/beneficios/transferencia")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isUnprocessableEntity())
            .andExpect(jsonPath("$.message", containsString("Saldo insuficiente")));
    }

    @Test
    @DisplayName("POST /transferencia retorna 400 quando fromId == toId")
    void transferir_400_mesmoId() throws Exception {
        doThrow(new IllegalArgumentException("fromId e toId não podem ser iguais."))
            .when(service).transferir(any());

        TransferenciaRequest req = buildTransferencia(1L, 1L, "100.00");

        mockMvc.perform(post("/api/v1/beneficios/transferencia")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message", containsString("não podem ser iguais")));
    }

    @Test
    @DisplayName("POST /transferencia retorna 400 quando valor é menor que 0.01")
    void transferir_400_valorInvalido() throws Exception {
        TransferenciaRequest req = buildTransferencia(1L, 2L, "0.00");

        mockMvc.perform(post("/api/v1/beneficios/transferencia")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isBadRequest());
    }

    // ── helpers ───────────────────────────────────────────────────────────────

    private BeneficioResponse buildResponse(Long id, String nome, String valor, boolean ativo) {
        com.example.backend.entity.Beneficio e = new com.example.backend.entity.Beneficio(nome, null, new BigDecimal(valor));
        e.setAtivo(ativo);
        try {
            java.lang.reflect.Field idField = com.example.backend.entity.Beneficio.class.getDeclaredField("id");
            idField.setAccessible(true);
            idField.set(e, id);
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
        return BeneficioResponse.from(e);
    }

    private BeneficioRequest buildRequest(String nome, String desc, String valor, boolean ativo) {
        BeneficioRequest r = new BeneficioRequest();
        r.setNome(nome);
        r.setDescricao(desc);
        r.setValor(valor != null ? new BigDecimal(valor) : null);
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
