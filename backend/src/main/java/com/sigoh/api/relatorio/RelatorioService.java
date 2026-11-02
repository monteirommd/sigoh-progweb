package com.sigoh.api.relatorio;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sigoh.api.leito.Leito;
import com.sigoh.api.leito.LeitoRepository;
import com.sigoh.api.leito.StatusLeito;
import com.sigoh.api.ocupacao.ClassificacaoTaxa;
import com.sigoh.api.ocupacao.OcupacaoService;
import com.sigoh.api.ocupacao.dto.OcupacaoBlocoDTO;

@Service
public class RelatorioService {

    private static final ZoneId FUSO = ZoneId.of("America/Sao_Paulo");
    private static final DateTimeFormatter DATA_HORA = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm").withZone(FUSO);
    private static final Color AZUL = new Color(0x18, 0x5F, 0xA5);
    private static final Color AZUL_ESCURO = new Color(0x0E, 0x3A, 0x66);
    private static final Color AZUL_CLARO = new Color(0xDC, 0xEA, 0xF8);

    private static final Font TITULO = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20, AZUL_ESCURO);
    private static final Font SUBTITULO = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 13, AZUL_ESCURO);
    private static final Font TEXTO = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.DARK_GRAY);
    private static final Font CABECALHO_TABELA = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, Color.WHITE);
    private static final Font CELULA = FontFactory.getFont(FontFactory.HELVETICA, 9, Color.BLACK);
    private static final Font DESTAQUE = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 26, AZUL);

    private final OcupacaoService ocupacaoService;
    private final LeitoRepository leitoRepository;

    public RelatorioService(OcupacaoService ocupacaoService, LeitoRepository leitoRepository) {
        this.ocupacaoService = ocupacaoService;
        this.leitoRepository = leitoRepository;
    }

    @Transactional(readOnly = true)
    public byte[] gerarOcupacao(String geradoPor) {
        List<OcupacaoBlocoDTO> blocos = ocupacaoService.porBloco();
        List<Leito> leitos = leitoRepository.findByAtivoTrue(Sort.by("enfermaria.bloco.nome", "enfermaria.nome", "codigo"));

        ByteArrayOutputStream saida = new ByteArrayOutputStream();
        Document documento = new Document(PageSize.A4, 36, 36, 36, 36);
        PdfWriter.getInstance(documento, saida);
        documento.open();

        documento.add(new Paragraph("SiGOH - Relatório de ocupação de leitos", TITULO));
        documento.add(new Paragraph("Gerado em " + DATA_HORA.format(Instant.now()) + " por " + geradoPor, TEXTO));

        adicionarResumoGeral(documento, blocos);
        adicionarTabelaBlocos(documento, blocos);
        adicionarTabelaLeitos(documento, leitos);

        documento.close();
        return saida.toByteArray();
    }

    private void adicionarResumoGeral(Document documento, List<OcupacaoBlocoDTO> blocos) {
        long total = blocos.stream().mapToLong(OcupacaoBlocoDTO::total).sum();
        long disponiveis = blocos.stream().mapToLong(OcupacaoBlocoDTO::disponiveis).sum();
        long ocupados = blocos.stream().mapToLong(OcupacaoBlocoDTO::ocupados).sum();
        long limpeza = blocos.stream().mapToLong(OcupacaoBlocoDTO::limpeza).sum();
        long bloqueados = blocos.stream().mapToLong(OcupacaoBlocoDTO::bloqueados).sum();
        double taxa = OcupacaoService.calcularTaxa(ocupados, total, bloqueados);

        documento.add(secao("Visão geral do hospital"));
        Paragraph taxaGeral = new Paragraph();
        taxaGeral.add(new Phrase(formatarTaxa(taxa) + "  ", DESTAQUE));
        taxaGeral.add(new Phrase("ocupação geral - " + ClassificacaoTaxa.geral(taxa), SUBTITULO));
        documento.add(taxaGeral);
        documento.add(new Paragraph(String.format(
                "%d leitos: %d disponíveis, %d ocupados, %d em limpeza, %d bloqueados",
                total, disponiveis, ocupados, limpeza, bloqueados), TEXTO));
    }

    private void adicionarTabelaBlocos(Document documento, List<OcupacaoBlocoDTO> blocos) {
        documento.add(secao("Ocupação por bloco"));
        PdfPTable tabela = novaTabela(new float[] { 2.4f, 1f, 1.7f, 1.5f, 1.3f, 1.7f, 1.1f, 1.4f },
                "Bloco", "Total", "Disponíveis", "Ocupados", "Limpeza", "Bloqueados", "Taxa", "Situação");
        for (OcupacaoBlocoDTO b : blocos) {
            celulas(tabela, b.blocoNome(), b.total(), b.disponiveis(), b.ocupados(), b.limpeza(), b.bloqueados(),
                    formatarTaxa(b.taxaOcupacao()), ClassificacaoTaxa.doBloco(b.taxaOcupacao()));
        }
        documento.add(tabela);
    }

    private void adicionarTabelaLeitos(Document documento, List<Leito> leitos) {
        documento.add(secao("Leitos"));
        PdfPTable tabela = novaTabela(new float[] { 2f, 2.5f, 1.2f, 1.5f, 2.3f, 2f },
                "Bloco", "Enfermaria", "Leito", "Status", "Atualizado em", "Por");
        for (Leito l : leitos) {
            celulas(tabela, l.getEnfermaria().getBloco().getNome(), l.getEnfermaria().getNome(), l.getCodigo(),
                    rotulo(l.getStatus()), DATA_HORA.format(l.getAtualizadoEm()),
                    l.getAtualizadoPor() == null ? "-" : l.getAtualizadoPor().getNome());
        }
        documento.add(tabela);
    }

    private Paragraph secao(String titulo) {
        Paragraph paragrafo = new Paragraph(titulo, SUBTITULO);
        paragrafo.setSpacingBefore(16);
        paragrafo.setSpacingAfter(6);
        return paragrafo;
    }

    private PdfPTable novaTabela(float[] larguras, String... cabecalhos) {
        PdfPTable tabela = new PdfPTable(larguras);
        tabela.setWidthPercentage(100);
        tabela.setHeaderRows(1);
        for (String cabecalho : cabecalhos) {
            PdfPCell celula = new PdfPCell(new Phrase(cabecalho, CABECALHO_TABELA));
            celula.setBackgroundColor(AZUL);
            celula.setPadding(5);
            tabela.addCell(celula);
        }
        return tabela;
    }

    private void celulas(PdfPTable tabela, Object... valores) {
        boolean zebra = (tabela.getRows().size() % 2) == 0;
        for (Object valor : valores) {
            PdfPCell celula = new PdfPCell(new Phrase(String.valueOf(valor), CELULA));
            celula.setPadding(4);
            if (zebra) celula.setBackgroundColor(AZUL_CLARO);
            if (valor instanceof Number) celula.setHorizontalAlignment(Element.ALIGN_RIGHT);
            tabela.addCell(celula);
        }
    }

    private String formatarTaxa(double taxa) {
        return String.format(Locale.forLanguageTag("pt-BR"), "%.1f%%", taxa);
    }

    private String rotulo(StatusLeito status) {
        return switch (status) {
            case DISPONIVEL -> "Disponível";
            case OCUPADO -> "Ocupado";
            case LIMPEZA -> "Em limpeza";
            case BLOQUEADO -> "Bloqueado";
        };
    }
}
