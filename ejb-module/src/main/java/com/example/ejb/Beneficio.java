package com.example.ejb;

import jakarta.persistence.*;
import java.math.BigDecimal;

/**
 * Entidade JPA que representa um Benefício.
 * A coluna VERSION habilita optimistic locking: se dois processos
 * lerem o mesmo registro e tentarem salvar, o segundo receberá
 * OptimisticLockException, evitando lost update.
 */
@Entity
@Table(name = "BENEFICIO")
public class Beneficio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(length = 255)
    private String descricao;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal valor;

    @Column(nullable = false)
    private Boolean ativo = true;

    /**
     * Coluna VERSION já existe no schema.sql.
     * O JPA incrementa automaticamente a cada UPDATE,
     * garantindo detecção de conflito concorrente.
     */
    @Version
    @Column(nullable = false)
    private Long version = 0L;

    // -------------------------------------------------------------------------
    // Construtores
    // -------------------------------------------------------------------------

    public Beneficio() {}

    public Beneficio(String nome, String descricao, BigDecimal valor) {
        this.nome = nome;
        this.descricao = descricao;
        this.valor = valor;
    }

    // -------------------------------------------------------------------------
    // Getters e Setters
    // -------------------------------------------------------------------------

    public Long getId() { return id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public BigDecimal getValor() { return valor; }
    public void setValor(BigDecimal valor) { this.valor = valor; }

    public Boolean getAtivo() { return ativo; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }

    public Long getVersion() { return version; }
}
