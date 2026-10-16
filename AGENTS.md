# AGENTS.md

## Regras do projeto

Este arquivo define as regras que devem ser consultadas antes de responder ou alterar o código do projeto.

### 1) Não criar ou rodar testes de feature
- Não escrever testes de feature para validar comportamento novo.
- Não executar testes de feature como parte do fluxo normal de desenvolvimento.
- Se houver necessidade de validação, ela deve ser mínima, direta e justificada; porém, a regra padrão do projeto é evitar testes de feature.

### 2) Não executar comandos no terminal, exceto quando forem extremamente necessários
- Evitar rodar comandos no terminal sempre que a ação puder ser concluída por leitura, inspeção ou edição direta dos arquivos.
- Só executar comandos no terminal quando houver necessidade crítica e claramente justificada, como:
  - verificar um erro de build impossível de confirmar por leitura;
  - confirmar comportamento de runtime que não pode ser inferido;
  - executar uma ação que dependa de ambiente real e não pode ser resolvida por análise estática.
- Caso seja necessário, o comando deve ser o mais simples e específico possível.
- Não usar terminal para validação repetitiva ou para testes de feature sem necessidade real.

### 3) Prioridades de trabalho
- Preferir leitura direta do código e do contexto do projeto.
- Fazer a menor alteração possível para resolver o problema.
- Respeitar os padrões já existentes no códigobase.
- Evitar mudanças extras, refatorações sem necessidade e arquivos não relacionados.

### 4) Padrão visual das páginas
- Usar `min-h-screen bg-muted/20 p-4 sm:p-8` como base de páginas internas e limitar o conteúdo com `mx-auto w-full max-w-6xl`.
- Agrupar conteúdo em painéis com `rounded-xl border border-border/70 bg-card shadow-sm`.
- Separar cabeçalhos de conteúdo com `border-b border-border/70`; usar `p-5` como espaçamento padrão dos painéis.
- Usar cores semânticas do tema (`text-primary`, `text-muted-foreground`, `bg-muted`) e controles com altura `h-10` e cantos `rounded-md`.
- Preferir ícones de `lucide-react` e manter ações e estados visuais consistentes com as páginas existentes.
- Em paginações, exibir números de página clicáveis, destacar a página atual e usar reticências quando houver páginas ocultas.

### 5) Resumo da postura
- Ler antes de agir.
- Alterar com precisão.
- Não criar testes de feature.
- Não rodar terminal sem extrema necessidade.
