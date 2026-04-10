package com.example.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

@Schema(description = "Dados para criação ou atualização de um benefício")
public class BeneficioRequest {

    @Schema(description = "Nome do benefício", example = "Vale Alimentação", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank
    private String nome;

    @Schema(description = "Descrição opcional do benefício", example = "Benefício para alimentação dos colaboradores")
    private String descricao;

    @Schema(description = "Valor do benefício em reais (deve ser maior que zero)", example = "500.00", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal valor;

    @Schema(description = "Indica se o benefício está ativo", example = "true", defaultValue = "true")
    private Boolean ativo = true;

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public BigDecimal getValor() { return valor; }
    public void setValor(BigDecimal valor) { this.valor = valor; }

    public Boolean getAtivo() { return ativo; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }
}
