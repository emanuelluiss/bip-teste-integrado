package com.example.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

@Schema(description = "Dados para transferência de saldo entre dois benefícios")
public class TransferenciaRequest {

    @Schema(description = "ID do benefício de origem (de onde o saldo será debitado)", example = "1", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull
    private Long fromId;

    @Schema(description = "ID do benefício de destino (onde o saldo será creditado)", example = "2", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull
    private Long toId;

    @Schema(description = "Valor a ser transferido (mínimo R$ 0,01)", example = "100.00", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull
    @DecimalMin(value = "0.01")
    private BigDecimal valor;

    public Long getFromId() { return fromId; }
    public void setFromId(Long fromId) { this.fromId = fromId; }

    public Long getToId() { return toId; }
    public void setToId(Long toId) { this.toId = toId; }

    public BigDecimal getValor() { return valor; }
    public void setValor(BigDecimal valor) { this.valor = valor; }
}
