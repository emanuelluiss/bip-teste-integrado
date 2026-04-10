package com.example.ejb;

import jakarta.ejb.Stateless;
import jakarta.ejb.TransactionAttribute;
import jakarta.ejb.TransactionAttributeType;
import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import jakarta.persistence.PersistenceContext;
import java.math.BigDecimal;

/**
 * Serviço EJB para operações sobre Benefício.
 *
 * CORREÇÕES aplicadas em relação ao código original:
 *
 * 1. Validação de argumentos nulos/inválidos antes de qualquer operação.
 * 2. Verificação de existência das entidades (evita NullPointerException).
 * 3. Verificação de saldo suficiente antes de subtrair (evita valor negativo).
 * 4. Locking otimista via @Version na entidade: se dois processos concorrentes
 *    tentarem modificar o mesmo Benefício, o segundo receberá
 *    OptimisticLockException e o container fará rollback automaticamente,
 *    eliminando o risco de lost update.
 * 5. A anotação @Stateless já implica transação gerenciada pelo container (CMT).
 *    REQUIRED é o padrão, mas declaramos explicitamente para deixar claro
 *    que toda a operação ocorre dentro de uma única transação: se qualquer
 *    passo falhar, nenhuma alteração é persistida.
 */
@Stateless
@TransactionAttribute(TransactionAttributeType.REQUIRED)
public class BeneficioEjbService {

    @PersistenceContext
    private EntityManager em;

    /**
     * Transfere {@code amount} do Benefício {@code fromId} para {@code toId}.
     *
     * @param fromId id do benefício de origem
     * @param toId   id do benefício de destino
     * @param amount valor a transferir (deve ser positivo)
     * @throws IllegalArgumentException se ids forem nulos, iguais, ou amount <= 0
     * @throws IllegalStateException    se algum benefício não for encontrado
     *                                  ou se o saldo de origem for insuficiente
     */
    public void transfer(Long fromId, Long toId, BigDecimal amount) {

        // -----------------------------------------------------------------
        // 1. Validação de argumentos
        // -----------------------------------------------------------------
        if (fromId == null || toId == null) {
            throw new IllegalArgumentException("fromId e toId não podem ser nulos.");
        }
        if (fromId.equals(toId)) {
            throw new IllegalArgumentException("fromId e toId não podem ser iguais.");
        }
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("O valor da transferência deve ser positivo.");
        }

        // -----------------------------------------------------------------
        // 2. Busca com OPTIMISTIC_FORCE_INCREMENT:
        //    Força incremento da VERSION mesmo em leituras, garantindo que
        //    qualquer outra transação concorrente que tente alterar o mesmo
        //    registro seja detectada e rejeitada com OptimisticLockException.
        // -----------------------------------------------------------------
        Beneficio from = em.find(Beneficio.class, fromId, LockModeType.OPTIMISTIC_FORCE_INCREMENT);
        Beneficio to   = em.find(Beneficio.class, toId,   LockModeType.OPTIMISTIC_FORCE_INCREMENT);

        // -----------------------------------------------------------------
        // 3. Verificação de existência
        // -----------------------------------------------------------------
        if (from == null) {
            throw new IllegalStateException("Benefício de origem não encontrado: id=" + fromId);
        }
        if (to == null) {
            throw new IllegalStateException("Benefício de destino não encontrado: id=" + toId);
        }

        // -----------------------------------------------------------------
        // 4. Verificação de saldo
        // -----------------------------------------------------------------
        if (from.getValor().compareTo(amount) < 0) {
            throw new IllegalStateException(
                String.format("Saldo insuficiente no benefício de origem (id=%d). " +
                              "Disponível: %s, Solicitado: %s",
                              fromId, from.getValor(), amount)
            );
        }

        // -----------------------------------------------------------------
        // 5. Operação de transferência
        //    O EntityManager detecta automaticamente as mudanças nas entidades
        //    gerenciadas (managed state), então em.merge() é desnecessário aqui.
        //    O flush/commit é realizado pelo container ao fim da transação.
        // -----------------------------------------------------------------
        from.setValor(from.getValor().subtract(amount));
        to.setValor(to.getValor().add(amount));
        // em.merge() removido: entidades já estão no estado "managed"
        // após em.find(), mudanças são detectadas automaticamente (dirty checking).
    }
}
