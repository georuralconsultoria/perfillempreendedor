# Estrutura do projeto — Perfil Empreendedor UEFS

```text
perfil-empreendedor-uefs/
├── index.html
├── supabase-setup.sql
├── google-apps-script.gs
├── modelo-planilha-respostas.xlsx
├── INTEGRAR-PLANILHA.md
├── FONTES-E-LICENCAS.md
├── css/
│   └── style.css
├── js/
│   ├── config.js
│   └── script.js
└── assets/
    ├── logo.svg
    ├── uefs-logo.png
    └── banner-estudantes.svg
```

## O que cada arquivo faz

- `index.html`: estrutura, textos, contatos e perguntas.
- `css/style.css`: aparência, cores, espaçamentos e adaptação para celular.
- `js/config.js`: URL e chave pública do Supabase e URL da planilha.
- `js/script.js`: validação, resultado e envio das respostas.
- `google-apps-script.gs`: recebe os dados do site e grava no Google Planilhas.
- `modelo-planilha-respostas.xlsx`: modelo com aba de respostas, resumo e instruções.
- `supabase-setup.sql`: cria a tabela e as políticas de segurança.
- `INTEGRAR-PLANILHA.md`: passo a passo para ativar a planilha.
- `assets/`: logotipos e ilustração.

## Configuração já aplicada

- Instituição: Universidade Estadual de Feira de Santana — UEFS.
- Curso: Engenharia de Alimentos.
- E-mail: Discenteuefs2026@gmail.com.
- Telefone: (75) 8298-5108.
- Direitos reservados no rodapé.
- Brasão da UEFS no cabeçalho e no rodapé.
- Supabase configurado com URL e Publishable Key.
- Google Planilhas preparado; falta somente inserir a URL do Apps Script em `js/config.js`.

## Publicar no GitHub

Mantenha o arquivo `index.html` na raiz e envie todas as pastas.

```text
Settings
→ Pages
→ Deploy from a branch
→ main
→ / (root)
```

Depois de atualizar os arquivos, aguarde a marca verde em `Actions` e pressione `Ctrl + F5` no site.
