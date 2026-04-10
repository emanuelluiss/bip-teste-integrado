package com.example.backend.service;

import com.example.backend.dto.BeneficioRequest;
import com.example.backend.dto.BeneficioResponse;
import com.example.backend.dto.TransferenciaRequest;
import com.example.backend.exception.BeneficioNotFoundException;
import com.example.backend.exception.SaldoInsuficienteException;
import com.example.backend.repository.BeneficioRepository;
import com.example.ejb.Beneficio;
import com.example.ejb.BeneficioEjbService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class BeneficioService {

    private final BeneficioRepository repository;
    private final BeneficioEjbService  ejbService;

    public BeneficioService(BeneficioRepository repository, BeneficioEjbService ejbService) {
        this.repository = repository;
        this.ejbService = ejbService;
    }

    @Transactional(readOnly = true)
    public List<BeneficioResponse> listar() {
        return repository.findAll().stream()
            .map(BeneficioResponse::from)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BeneficioResponse buscar(Long id) {
        return BeneficioResponse.from(findOrThrow(id));
    }

    public BeneficioResponse criar(BeneficioRequest req) {
        Beneficio b = new Beneficio(req.getNome(), req.getDescricao(), req.getValor());
        if (req.getAtivo() != null) b.setAtivo(req.getAtivo());
        return BeneficioResponse.from(repository.save(b));
    }

    public BeneficioResponse atualizar(Long id, BeneficioRequest req) {
        Beneficio b = findOrThrow(id);
        b.setNome(req.getNome());
        b.setDescricao(req.getDescricao());
        b.setValor(req.getValor());
        if (req.getAtivo() != null) b.setAtivo(req.getAtivo());
        return BeneficioResponse.from(repository.save(b));
    }

    public void deletar(Long id) {
        findOrThrow(id);
        repository.deleteById(id);
    }

    /**
     * Delega a transferência ao BeneficioEjbService, que aplica
     * OPTIMISTIC_FORCE_INCREMENT nos dois registros e verifica saldo
     * antes de subtrair. O rollback é garantido pelo @Transactional do Spring,
     * que envolve toda a chamada (equivalente ao CMT REQUIRED do EJB).
     *
     * Exceções do EJB são mapeadas para as exceções de domínio do backend:
     *  - IllegalStateException "Saldo insuficiente" → SaldoInsuficienteException (HTTP 422)
     *  - IllegalStateException "não encontrado"     → BeneficioNotFoundException (HTTP 404)
     *  - IllegalArgumentException                   → re-lançada diretamente   (HTTP 400)
     */
    public void transferir(TransferenciaRequest req) {
        try {
            ejbService.transfer(req.getFromId(), req.getToId(), req.getValor());
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (IllegalStateException e) {
            String msg = e.getMessage() != null ? e.getMessage() : "";
            if (msg.contains("Saldo insuficiente")) {
                throw new SaldoInsuficienteException(req.getFromId(), req.getValor(), req.getValor());
            }
            Long id = msg.contains("origem") ? req.getFromId() : req.getToId();
            throw new BeneficioNotFoundException(id);
        }
    }

    private Beneficio findOrThrow(Long id) {
        return repository.findById(id).orElseThrow(() -> new BeneficioNotFoundException(id));
    }
}
