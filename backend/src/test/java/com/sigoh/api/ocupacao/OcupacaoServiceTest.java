package com.sigoh.api.ocupacao;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

class OcupacaoServiceTest {

    @ParameterizedTest(name = "{0} ocupados de {1} leitos com {2} bloqueados = {3}%")
    @CsvSource({
            "1, 5, 1, 25.0",
            "3, 3, 0, 100.0",
            "0, 10, 0, 0.0",
            "1, 3, 0, 33.3",
            "2, 4, 4, 0.0",
            "0, 0, 0, 0.0"
    })
    void calculaTaxaDesconsiderandoBloqueados(long ocupados, long total, long bloqueados, double esperado) {
        assertThat(OcupacaoService.calcularTaxa(ocupados, total, bloqueados)).isEqualTo(esperado);
    }
}
