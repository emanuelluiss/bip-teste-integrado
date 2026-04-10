package com.example.backend.dto;

import com.example.ejb.Beneficio;
import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;

@Schema(description = "Dados retornados de um benefício")
public class BeneficioResponse {

    @Schema(description = "Identificador único do benefício", example = "1")
    private Long id;

    @Schema(description = "Nome do benefício", example = "Vale Alimentação")
    private String nome;

    @Schema(description = "Descrição do benefício", example = "Benefício para alimentação dos colaboradores")
    private String descricao;

    @Schema(description = "Valor atual do benefício em reais", example = "500.00")
    private BigDecimal valor;

    @Schema(description = "Indica se o benefício está ativo", example = "true")
    private Boolean ativo;

    @Schema(description = "Versão do registro utilizada para controle de concorrência otimista", example = "0")
    private Long version;

    public static BeneficioResponse from(Beneficio b) {
        BeneficioResponse r = new BeneficioResponse();
        r.id = b.getId();
        r.nome = b.getNome();
        r.descricao = b.getDescricao();
        r.valor = b.getValor();
        r.ativo = b.getAtivo();
        r.version = b.getVersion();
        return r;
    }

    public Long getId() { return id; }
    public String getNome() { return nome; }
    public String getDescricao() { return descricao; }
    public BigDecimal getValor() { return valor; }
    public Boolean getAtivo() { return ativo; }
    public Long getVersion() { return version; }
}
