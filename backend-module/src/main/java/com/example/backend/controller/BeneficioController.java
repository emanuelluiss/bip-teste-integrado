package com.example.backend.controller;

import com.example.backend.dto.BeneficioRequest;
import com.example.backend.dto.BeneficioResponse;
import com.example.backend.dto.TransferenciaRequest;
import com.example.backend.service.BeneficioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/beneficios")
@Tag(name = "Benefícios", description = "Operações de CRUD e transferência de saldo entre benefícios")
public class BeneficioController {

    private final BeneficioService service;

    public BeneficioController(BeneficioService service) {
        this.service = service;
    }

    @Operation(summary = "Listar todos os benefícios", description = "Retorna a lista completa de benefícios cadastrados.")
    @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = BeneficioResponse.class))))
    @GetMapping
    public List<BeneficioResponse> listar() {
        return service.listar();
    }

    @Operation(summary = "Buscar benefício por ID", description = "Retorna um único benefício pelo seu identificador.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Benefício encontrado",
                    content = @Content(schema = @Schema(implementation = BeneficioResponse.class))),
            @ApiResponse(responseCode = "404", description = "Benefício não encontrado", content = @Content)
    })
    @GetMapping("/{id}")
    public BeneficioResponse buscar(
            @Parameter(description = "ID do benefício", required = true, example = "1")
            @PathVariable Long id) {
        return service.buscar(id);
    }

    @Operation(summary = "Criar novo benefício", description = "Cadastra um novo benefício no sistema.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Benefício criado com sucesso",
                    content = @Content(schema = @Schema(implementation = BeneficioResponse.class))),
            @ApiResponse(responseCode = "400", description = "Dados inválidos na requisição", content = @Content)
    })
    @PostMapping
    public ResponseEntity<BeneficioResponse> criar(@Valid @RequestBody BeneficioRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(req));
    }

    @Operation(summary = "Atualizar benefício", description = "Atualiza os dados de um benefício existente.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Benefício atualizado com sucesso",
                    content = @Content(schema = @Schema(implementation = BeneficioResponse.class))),
            @ApiResponse(responseCode = "400", description = "Dados inválidos na requisição", content = @Content),
            @ApiResponse(responseCode = "404", description = "Benefício não encontrado", content = @Content)
    })
    @PutMapping("/{id}")
    public BeneficioResponse atualizar(
            @Parameter(description = "ID do benefício a atualizar", required = true, example = "1")
            @PathVariable Long id,
            @Valid @RequestBody BeneficioRequest req) {
        return service.atualizar(id, req);
    }

    @Operation(summary = "Excluir benefício", description = "Remove permanentemente um benefício pelo seu ID.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Benefício excluído com sucesso"),
            @ApiResponse(responseCode = "404", description = "Benefício não encontrado", content = @Content)
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(
            @Parameter(description = "ID do benefício a excluir", required = true, example = "1")
            @PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Transferir saldo entre benefícios",
            description = "Debita o valor do benefício de origem e credita no benefício de destino de forma atômica.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Transferência realizada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos ou IDs iguais", content = @Content),
            @ApiResponse(responseCode = "404", description = "Benefício de origem ou destino não encontrado", content = @Content),
            @ApiResponse(responseCode = "422", description = "Saldo insuficiente no benefício de origem", content = @Content)
    })
    @PostMapping("/transferencia")
    public ResponseEntity<Void> transferir(@Valid @RequestBody TransferenciaRequest req) {
        service.transferir(req);
        return ResponseEntity.noContent().build();
    }
}
