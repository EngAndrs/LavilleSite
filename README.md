# LAVille Lavanderia Blue — Site institucional (versão modernizada · out/2026)

Site estático: **HTML + CSS + JavaScript puro**, sem frameworks, sem backend e sem etapa de build.

```
laville/
├── index.html   → estrutura e conteúdo
├── style.css    → visual completo (responsivo)
├── script.js    → menu, FAQ, animações e ENVIO DO FORMULÁRIO
├── logo.png     → logo (usada no header, diferenciais, "Sobre" e favicon)
└── README.md    → este arquivo
```

---

## 1. O que foi alterado

### index.html
- **Bug corrigido no header:** a tag `</a>` da logo estava dentro de um comentário, então o menu inteiro ficava *dentro* do link da logo. Estrutura refeita.
- **Menu** (header, menu mobile e rodapé): Início · Serviços · **Pacotes** · **Como Funciona** · Sobre Nós · Contato. Botão do header passou a ser "Ver pacotes".
- **Hero:** textos revisados; ações principais = *Ver pacotes e preços*, *Falar no WhatsApp* e link para o formulário de e-mail. O card ilustrativo não mostra mais "Coletado"/"Saindo para entrega" (agora: Recebido → Lavagem → Passadoria → Pronto).
- **Serviços:** os 5 parágrafos longos foram condensados (mesmo conteúdo, sem `<br>` para espaçamento); cards com ícones em linha no lugar de emojis.
- **Planos Mensais removidos** (Básico, Premium, Empresarial, "Mais Popular", botões "Assinar Plano").
- **Nova seção "Pacotes de Lavanderia — Tabela de Preços 2026"** (`#pacotes`) com os 6 pacotes e os valores exatos informados, rótulos "Preço do pacote" e "Débito/Crédito" e botão "Consultar este pacote" que abre o WhatsApp com o nome do pacote na mensagem.
- **Como Funciona:** etapa "Coletamos suas roupas" removida. Nova sequência: Escolha o seu pacote → Entregue suas peças (combinado pelo WhatsApp) → Cuidamos de tudo → Suas roupas prontas.
- **Outras referências à coleta removidas:** meta description/keywords, diferencial "Coleta e entrega", FAQ "Vocês fazem coleta?" e FAQ "Quais bairros atendem?" (pressupunha área de coleta).
- **FAQ:** perguntas revisadas ("Como funcionam os pacotes?", "Como entrego minhas roupas?"); a resposta sobre empresas não cita mais "plano empresarial".
- **Formulário:** campos Nome completo*, Telefone (opcional), E-mail*, **Assunto*** e Mensagem*; botão **"Enviar mensagem"**; mensagens de erro por campo; área de status; campo anti-spam (honeypot).
- **Rodapé:** link do Facebook removido (apontava para `#`, ou seja, estava quebrado); adicionados links para Pacotes, Como funciona e FAQ.
- Acessibilidade: link "Pular para o conteúdo", FAQ com títulos semânticos, `aria-invalid` nos campos, `aria-current` no menu.
- Seções "Depoimentos" e "Tabela de preços" antigas (já vazias/comentadas) não foram recriadas — não há depoimentos reais fornecidos.

### style.css
- Reescrito mantendo a paleta (azul-marinho `#0D47A1`, azul-claro `#4FC3F7`, branco e cinzas) e as fontes Playfair Display + DM Sans.
- Removidos efeitos excessivos (bolhas e ondas animadas, cards flutuando, pulso do WhatsApp, `scale` do plano Premium).
- Novos estilos: cards de pacotes, etapas, estados de erro/sucesso do formulário, spinner (antes era injetado via JS).
- Responsividade revista: 3 → 2 → 1 coluna; menu mobile até 900px; campos com 16px (evita zoom no iPhone); `scroll-padding-top` para o header fixo; suporte a `prefers-reduced-motion`.
- Removido CSS sem uso (carrossel de depoimentos, tabela de preços antiga, planos).

### script.js
- **Envio real do formulário** via serviço de formulários (ver seção 4) com `fetch`, tempo limite de 15 s, bloqueio de envios duplicados e mensagem de sucesso **apenas quando o serviço confirma** o recebimento. Em caso de falha, os dados digitados são mantidos.
- Validação: obrigatórios, formato de e-mail, tamanho mínimo; foco no primeiro campo inválido.
- Máscara de telefone mantida (agora aceita fixo e celular).
- Menu mobile: fecha com Esc, ao clicar fora e ao escolher um link.
- Removidos: carrossel de depoimentos (a seção não existe) e injeção de `@keyframes` via JS.
- Mantidos: header com sombra, link ativo, FAQ, animação de entrada, voltar ao topo, ano automático, rolagem suave.

`logo.png` não foi alterado.

---

## 2. Como executar localmente no VS Code

1. Abra a pasta do projeto no VS Code (*Arquivo → Abrir Pasta*).
2. Instale a extensão **Live Server** (Ritwick Dey).
3. Clique com o botão direito em `index.html` → **Open with Live Server**.
4. O site abre em `http://127.0.0.1:5500/index.html`.

> Use o Live Server (ou outro servidor local) em vez de abrir o arquivo com duplo clique (`file://`): os serviços de formulário costumam recusar envios vindos de `file://`.

---

## 3. Publicação

Não há mudança no processo de hospedagem: basta enviar os 4 arquivos (`index.html`, `style.css`, `script.js`, `logo.png`) para a mesma pasta do servidor, substituindo os anteriores. Funciona em qualquer hospedagem estática (Hostinger, HostGator, GitHub Pages, Netlify, Vercel etc.).

Depois de publicar, limpe o cache do navegador (Ctrl+F5) para ver a versão nova.

---

## 4. Configuração do envio de e-mails (OBRIGATÓRIO antes de usar)

Como o site é estático, o envio é feito por um serviço externo. Nenhuma senha, token ou chave privada fica no código. O endereço configurado é o e-mail já divulgado no site:

```js
// script.js → bloco FORM_CONFIG (topo do arquivo)
endpoint: 'https://formsubmit.co/ajax/lavanderialaville@gmail.com'
```

### Opção padrão: FormSubmit (gratuito, sem cadastro)
1. Publique o site (ou rode pelo Live Server).
2. Envie **uma mensagem de teste** pelo formulário. Nesse primeiro envio o site mostrará *"Não foi possível enviar"* — é o esperado: o FormSubmit ainda não está ativado.
3. Abra a caixa de entrada de **lavanderialaville@gmail.com** (verifique também Spam/Promoções), localize o e-mail do FormSubmit e clique em **Activate Form**.
4. Envie outra mensagem de teste. Agora o site deve exibir *"Mensagem enviada com sucesso!"* e o e-mail deve chegar na caixa de entrada.
5. (Recomendado) No e-mail de confirmação, o FormSubmit informa um endereço alternativo aleatório. Troque o e-mail na URL do `endpoint` por esse código para não expor o e-mail no código-fonte:
   `endpoint: 'https://formsubmit.co/ajax/SEU_CODIGO_ALEATORIO'`

Para receber em outro e-mail, troque o endereço no `endpoint` e repita a ativação.

### Alternativa: Formspree
1. Crie uma conta em formspree.io e um novo formulário apontando para o e-mail da lavanderia.
2. Copie a URL do formulário (ex.: `https://formspree.io/f/abcdwxyz`).
3. Cole em `FORM_CONFIG.endpoint`. O código já reconhece a resposta do Formspree; nada mais precisa mudar.

### Variáveis de ambiente
Não se aplicam: não há backend nem credenciais privadas. Se no futuro for criado um backend próprio (ex.: Node + SMTP), as credenciais SMTP devem ficar em variáveis de ambiente do servidor, nunca no `script.js`.

### Como o e-mail chega
Assunto: `[Site LAVille] <assunto digitado>`. Corpo em tabela com nome, e-mail, telefone, assunto e mensagem. Responder ao e-mail responde diretamente ao visitante.

---

## 5. Testes executados (Chromium automatizado, out/2026)

Ambiente: servidor local + Chromium (Playwright) em 1440×900 (desktop), 820×1180 (tablet) e 390×844 (celular). **59 de 59 verificações aprovadas.**

| Área | Verificação | Resultado |
|---|---|---|
| Visual | Sem rolagem horizontal e nenhum elemento além da tela nos 3 tamanhos | Aprovado |
| Visual | Capturas de tela revisadas (alinhamento, cores, espaçamento, legibilidade) | Aprovado |
| Técnico | Nenhum erro de JavaScript no console; arquivos locais (CSS, JS, logo) carregados | Aprovado |
| Técnico | HTML com tags balanceadas, sem `id` duplicado; `script.js` sem erro de sintaxe | Aprovado |
| Navegação | Menu mobile abre, fecha ao escolher link, fecha com Esc (tablet e celular) | Aprovado |
| Navegação | Os 6 links do menu levam à seção correta, sem ficar sob o header | Aprovado |
| Navegação | Todas as 8 âncoras internas existem; nenhum link `href="#"` | Aprovado |
| Navegação | Os 12 links de WhatsApp usam o número do projeto (85) 99837-1212 | Aprovado |
| Pacotes | 6 pacotes com nome, quantidade, preço e débito/crédito exatos | Aprovado |
| Pacotes | Botão de cada pacote leva o nome do pacote na mensagem do WhatsApp | Aprovado |
| Conteúdo | Nenhum texto visível com "coleta", "mensal", "assinatura", "assinar", "plano" | Aprovado |
| Conteúdo | "Como Funciona" com 4 etapas, nenhuma de coleta | Aprovado |
| FAQ | Abre e fecha, mantendo apenas um item aberto | Aprovado |
| Formulário | Envio vazio: bloqueado, 4 campos destacados, foco no primeiro, nada enviado | Aprovado |
| Formulário | E-mail inválido: bloqueado com mensagem específica | Aprovado |
| Formulário | Mensagem válida: botão desabilitado com "Enviando...", 1 única requisição mesmo com 2º envio, dados corretos, confirmação exibida, campos limpos | Aprovado (serviço simulado) |
| Formulário | Falhas (formulário não ativado, erro 500, sem rede): mensagem de erro, dados mantidos, botão liberado | Aprovado (serviço simulado) |
| Formulário | **Recebimento real no e-mail** | **Não testado** — o ambiente de testes não tem acesso à internet e a ativação depende do proprietário (seção 4) |

Observação: no ambiente de teste as fontes do Google e o mapa não carregam (sem internet), então as capturas usam fontes alternativas; no site publicado elas carregam normalmente.

---

## 6. Pendências que dependem do proprietário

1. **Ativar o FormSubmit** no e-mail lavanderialaville@gmail.com e fazer um envio de teste real (seção 4). Até isso ser feito, o formulário exibirá a mensagem de falha.
2. **Como o cliente entrega as peças** (na unidade, agendamento etc.) e **como recebe as roupas prontas** (retirada na unidade e/ou entrega em domicílio, bairros, custo). Hoje o site diz apenas "combine pelo WhatsApp" e "conforme o combinado no atendimento".
3. **Prazo:** o site antigo dizia "até 24h" nos diferenciais e "24 a 48 horas, expresso em até 12 horas" no FAQ. Foi mantido "24 a 48 horas" em ambos e o "expresso" ficou sem prazo ("consulte a disponibilidade"). Confirmar.
4. **Confirmar os números e afirmações** que já estavam no site: +2.000 clientes, +50.000 peças, avaliação 5 ★, +5 anos de experiência, "garantia de satisfação: refazemos sem custo", "produtos biodegradáveis". Se algum não for comprovável, remover.
5. **Formas de pagamento** (Pix, dinheiro, débito e crédito) — confirmar.
6. **Fotos reais** (fachada, equipe, roupas passadas): não foram usadas imagens de banco para não exibir fotos sem licença. Para incluir, troque o conteúdo de `.sobre-img-bg` (seção "Quem Somos") por `<img src="sua-foto.jpg" alt="...">`.
7. **Facebook:** o link não tinha endereço; foi removido. Se houver página, informe o link.
8. **O que cada pacote inclui** (lavagem, secagem, passadoria?) e o que conta como "peça simples" — não foi descrito no site para não criar condições não informadas.
