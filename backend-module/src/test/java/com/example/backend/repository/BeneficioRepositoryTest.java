package com.example.backend.repository;

import com.example.backend.entity.Beneficio;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.jdbc.Sql;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@Sql(scripts = "/schema.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_CLASS)
class BeneficioRepositoryTest {

    @Autowired
    private BeneficioRepository repository;

    // ── save / findById ───────────────────────────────────────────────────────

    @Test
    @DisplayName("save() persiste e gera ID automaticamente")
    void save_geraId() {
        Beneficio b = new Beneficio("Educação", "Bolsa educação", new BigDecimal("750.00"));
        Beneficio saved = repository.save(b);

        assertThat(saved.getId()).isNotNull().isPositive();
        assertThat(saved.getNome()).isEqualTo("Educação");
        assertThat(saved.getValor()).isEqualByComparingTo("750.00");
        assertThat(saved.getAtivo()).isTrue();
        assertThat(saved.getVersion()).isNotNull();
    }

    @Test
    @DisplayName("findById() retorna Optional com entidade quando existe")
    void findById_encontrado() {
        Beneficio saved = repository.save(new Beneficio("Lazer", null, new BigDecimal("200.00")));

        Optional<Beneficio> result = repository.findById(saved.getId());

        assertThat(result).isPresent();
        assertThat(result.get().getNome()).isEqualTo("Lazer");
    }

    @Test
    @DisplayName("findById() retorna Optional vazio para ID inexistente")
    void findById_naoEncontrado() {
        assertThat(repository.findById(99999L)).isEmpty();
    }

    // ── findAll ───────────────────────────────────────────────────────────────

    @Test
    @DisplayName("findAll() retorna todos os registros salvos")
    void findAll_retornaRegistros() {
        repository.save(new Beneficio("A", null, new BigDecimal("100.00")));
        repository.save(new Beneficio("B", null, new BigDecimal("200.00")));

        List<Beneficio> all = repository.findAll();

        assertThat(all).hasSizeGreaterThanOrEqualTo(2);
    }

    // ── deleteById ────────────────────────────────────────────────────────────

    @Test
    @DisplayName("deleteById() remove o registro e findById retorna vazio")
    void deleteById_remove() {
        Beneficio saved = repository.save(new Beneficio("Temporário", null, new BigDecimal("1.00")));
        Long id = saved.getId();

        repository.deleteById(id);

        assertThat(repository.findById(id)).isEmpty();
    }

    // ── findByIdForUpdate ─────────────────────────────────────────────────────

    @Test
    @DisplayName("findByIdForUpdate() retorna entidade existente com lock")
    void findByIdForUpdate_encontrado() {
        Beneficio saved = repository.save(new Beneficio("Lock Test", null, new BigDecimal("300.00")));

        Optional<Beneficio> result = repository.findByIdForUpdate(saved.getId());

        assertThat(result).isPresent();
        assertThat(result.get().getNome()).isEqualTo("Lock Test");
    }

    @Test
    @DisplayName("findByIdForUpdate() retorna Optional vazio para ID inexistente")
    void findByIdForUpdate_naoEncontrado() {
        assertThat(repository.findByIdForUpdate(99999L)).isEmpty();
    }

    // ── version (optimistic locking) ──────────────────────────────────────────

    @Test
    @DisplayName("version é inicializado como 0 ao persistir")
    void version_inicialZero() {
        Beneficio saved = repository.save(new Beneficio("Version Test", null, new BigDecimal("100.00")));

        assertThat(saved.getVersion()).isEqualTo(0L);
    }

    @Test
    @DisplayName("version é incrementado após update")
    void version_incrementaAposUpdate() {
        Beneficio saved = repository.save(new Beneficio("Versionado", null, new BigDecimal("100.00")));
        assertThat(saved.getVersion()).isEqualTo(0L);

        saved.setValor(new BigDecimal("200.00"));
        Beneficio updated = repository.saveAndFlush(saved);

        assertThat(updated.getVersion()).isEqualTo(1L);
    }

    // ── campo ativo ───────────────────────────────────────────────────────────

    @Test
    @DisplayName("ativo padrão é true ao criar sem definir")
    void ativo_defaultTrue() {
        Beneficio saved = repository.save(new Beneficio("Padrão Ativo", null, new BigDecimal("50.00")));

        assertThat(saved.getAtivo()).isTrue();
    }

    @Test
    @DisplayName("ativo pode ser salvo como false")
    void ativo_salvarFalse() {
        Beneficio b = new Beneficio("Inativo", null, new BigDecimal("50.00"));
        b.setAtivo(false);
        Beneficio saved = repository.save(b);

        assertThat(saved.getAtivo()).isFalse();
    }
}
