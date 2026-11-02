package com.sigoh.api.ocupacao;

public final class ClassificacaoTaxa {

    private ClassificacaoTaxa() {
    }

    public static String doBloco(double taxa) {
        if (taxa < 80) return "Seguro";
        if (taxa < 90) return "Atenção";
        if (taxa < 95) return "Risco";
        return "Crítico";
    }

    public static String geral(double taxa) {
        if (taxa < 75) return "Normalidade";
        if (taxa < 85) return "Alerta";
        if (taxa < 95) return "Crítico";
        return "Colapso";
    }
}
