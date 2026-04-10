package com.example.backend.config;

import com.example.ejb.BeneficioEjbService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Registra o BeneficioEjbService como um Spring bean.
 *
 * Sem um container EJB (WildFly/GlassFish), as anotações @Stateless e
 * @TransactionAttribute são ignoradas em tempo de execução. O Spring assume
 * o gerenciamento do ciclo de vida e da transação (@Transactional no Service
 * chamador). O @PersistenceContext é processado pelo
 * PersistenceAnnotationBeanPostProcessor do Spring Boot, que injeta o
 * EntityManager gerenciado pelo contexto JPA da aplicação.
 */
@Configuration
public class EjbConfig {

    @Bean
    public BeneficioEjbService beneficioEjbService() {
        return new BeneficioEjbService();
    }
}
