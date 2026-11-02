package com.sigoh.api.leito;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.sigoh.api.bloco.Bloco;
import com.sigoh.api.common.exception.BusinessException;
import com.sigoh.api.common.exception.ResourceNotFoundException;
import com.sigoh.api.enfermaria.Enfermaria;
import com.sigoh.api.enfermaria.EnfermariaRepository;
import com.sigoh.api.historico.HistoricoLeito;
import com.sigoh.api.historico.HistoricoLeitoRepository;
import com.sigoh.api.leito.dto.LeitoRequestDTO;
import com.sigoh.api.leito.dto.LeitoResponseDTO;
import com.sigoh.api.leito.dto.StatusLeitoRequestDTO;
import com.sigoh.api.usuario.Usuario;
import com.sigoh.api.usuario.UsuarioRepository;

@ExtendWith(MockitoExtension.class)
class LeitoServiceTest {

    @Mock
    private LeitoRepository leitoRepository;

    @Mock
    private EnfermariaRepository enfermariaRepository;

    @Mock
    private HistoricoLeitoRepository historicoRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    private LeitoService service;
    private Enfermaria enfermaria;
    private Leito leito;
    private Usuario tecnico;

    @BeforeEach
    void preparar() {
        service = new LeitoService(leitoRepository, enfermariaRepository, historicoRepository, usuarioRepository,
                new LeitoMapper());

        Bloco bloco = new Bloco();
        bloco.setId(1L);
        bloco.setNome("Bloco Norte");

        enfermaria = new Enfermaria();
        enfermaria.setId(10L);
        enfermaria.setNome("Clinica Medica");
        enfermaria.setBloco(bloco);

        leito = new Leito();
        leito.setId(100L);
        leito.setCodigo("L01");
        leito.setEnfermaria(enfermaria);
        leito.setStatus(StatusLeito.DISPONIVEL);

        tecnico = new Usuario();
        tecnico.setId(3L);
        tecnico.setNome("Tecnico");
    }

    @Test
    void alterarStatusAtualizaLeitoEGravaHistorico() {
        when(leitoRepository.findByIdAndAtivoTrue(100L)).thenReturn(Optional.of(leito));
        when(usuarioRepository.getReferenceById(3L)).thenReturn(tecnico);

        LeitoResponseDTO resposta = service.alterarStatus(100L, new StatusLeitoRequestDTO(StatusLeito.OCUPADO), 3L);

        assertThat(resposta.status()).isEqualTo(StatusLeito.OCUPADO);
        assertThat(resposta.atualizadoPorNome()).isEqualTo("Tecnico");
        assertThat(leito.getAtualizadoEm()).isNotNull();

        ArgumentCaptor<HistoricoLeito> captor = ArgumentCaptor.forClass(HistoricoLeito.class);
        verify(historicoRepository).save(captor.capture());
        HistoricoLeito historico = captor.getValue();
        assertThat(historico.getLeito()).isSameAs(leito);
        assertThat(historico.getStatusAnterior()).isEqualTo(StatusLeito.DISPONIVEL);
        assertThat(historico.getStatusNovo()).isEqualTo(StatusLeito.OCUPADO);
        assertThat(historico.getUsuario()).isSameAs(tecnico);
    }

    @Test
    void alterarParaOMesmoStatusLancaErroENaoGravaHistorico() {
        when(leitoRepository.findByIdAndAtivoTrue(100L)).thenReturn(Optional.of(leito));

        assertThatThrownBy(() -> service.alterarStatus(100L, new StatusLeitoRequestDTO(StatusLeito.DISPONIVEL), 3L))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("já está com o status");

        verify(historicoRepository, never()).save(any());
        assertThat(leito.getStatus()).isEqualTo(StatusLeito.DISPONIVEL);
    }

    @Test
    void alterarStatusDeLeitoInexistenteLancaNaoEncontrado() {
        when(leitoRepository.findByIdAndAtivoTrue(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.alterarStatus(999L, new StatusLeitoRequestDTO(StatusLeito.OCUPADO), 3L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("999");

        verify(historicoRepository, never()).save(any());
    }

    @Test
    void criarLeitoComCodigoDuplicadoLancaErroENaoSalva() {
        when(enfermariaRepository.findComBlocoById(10L)).thenReturn(Optional.of(enfermaria));
        when(leitoRepository.existsByEnfermariaIdAndCodigoIgnoreCaseAndAtivoTrue(10L, "L01")).thenReturn(true);

        assertThatThrownBy(() -> service.criar(new LeitoRequestDTO("  L01 ", 10L)))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("L01");

        verify(leitoRepository, never()).save(any());
    }

    @Test
    void excluirLeitoFazExclusaoLogica() {
        when(leitoRepository.findByIdAndAtivoTrue(100L)).thenReturn(Optional.of(leito));

        service.excluir(100L);

        assertThat(leito.isAtivo()).isFalse();
        verify(leitoRepository, never()).delete(any());
    }
}
