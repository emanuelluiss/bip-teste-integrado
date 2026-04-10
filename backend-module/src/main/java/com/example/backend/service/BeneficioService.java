package com.example.backend.service;

import com.example.backend.dto.BeneficioRequest;
import com.example.backend.dto.BeneficioResponse;
import com.example.backend.dto.TransferenciaRequest;
import com.example.backend.entity.Beneficio;
import com.example.backend.exception.BeneficioNotFoundException;
import com.example.backend.exception.SaldoInsuficienteException;
import com.example.backend.repository.BeneficioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class BeneficioService {

    private final BeneficioRepository repository;

    public BeneficioService(BeneficioRepository repository) {
        this.repository = repository;
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
     * Transfere valor entre dois benefícios.
     *
     * Anti-deadlock: os locks são adquiridos sempre na ordem crescente de ID,
     * impedindo que duas transações concorrentes tentem bloquear os mesmos
     * registros em ordens opostas.
     */
    public void transferir(TransferenciaRequest req) {
        Long fromId = req.getFromId();
        Long toId   = req.getToId();

        if (fromId.equals(toId)) {
            throw new IllegalArgumentException("fromId e toId não podem ser iguais.");
        }

        // Adquire locks em ordem crescente de ID para evitar deadlock
        Long firstId  = fromId < toId ? fromId : toId;
        Long secondId = fromId < toId ? toId   : fromId;

        Beneficio first  = lockOrThrow(firstId);
        Beneficio second = lockOrThrow(secondId);

        Beneficio from = firstId.equals(fromId) ? first : second;
        Beneficio to   = firstId.equals(toId)   ? first : second;

        if (from.getValor().compareTo(req.getValor()) < 0) {
            throw new SaldoInsuficienteException(fromId, from.getValor(), req.getValor());
        }

        from.setValor(from.getValor().subtract(req.getValor()));
        to.setValor(to.getValor().add(req.getValor()));
    }

    private Beneficio findOrThrow(Long id) {
        return repository.findById(id).orElseThrow(() -> new BeneficioNotFoundException(id));
    }

    private Beneficio lockOrThrow(Long id) {
        return repository.findByIdForUpdate(id).orElseThrow(() -> new BeneficioNotFoundException(id));
    }
}
