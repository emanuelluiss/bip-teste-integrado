package com.example.backend.dto;

import com.example.backend.entity.Beneficio;
import java.math.BigDecimal;

public class BeneficioResponse {

    private Long id;
    private String nome;
    private String descricao;
    private BigDecimal valor;
    private Boolean ativo;
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
