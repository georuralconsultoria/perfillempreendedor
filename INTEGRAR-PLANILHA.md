# Integrar o site com Google Planilhas

O site já está preparado para manter os dados no Supabase e também enviar cada resposta para uma planilha do Google.

## Arquivos envolvidos

- `google-apps-script.gs`: recebe os dados e grava na planilha.
- `js/config.js`: recebe a URL pública do Apps Script.
- `modelo-planilha-respostas.xlsx`: modelo que pode ser enviado ao Google Drive.

## Etapa 1 — Abrir a planilha

1. Envie `modelo-planilha-respostas.xlsx` ao Google Drive.
2. Clique com o botão direito.
3. Selecione **Abrir com > Google Planilhas**.
4. Salve como uma planilha Google, caso o Drive solicite.

Também é possível criar uma planilha vazia. O código criará a aba `Respostas` automaticamente.

## Etapa 2 — Adicionar o Apps Script

1. Com a planilha aberta, clique em **Extensões > Apps Script**.
2. Apague o código existente.
3. Copie todo o conteúdo do arquivo `google-apps-script.gs`.
4. Cole no editor.
5. Clique em **Salvar**.

## Etapa 3 — Publicar como App da Web

1. Clique em **Implantar > Nova implantação**.
2. Em “Selecione o tipo”, escolha **App da Web**.
3. Em “Executar como”, escolha **Eu**.
4. Em “Quem pode acessar”, escolha **Qualquer pessoa**.
5. Clique em **Implantar**.
6. Autorize o acesso solicitado.
7. Copie a URL que termina em `/exec`.

## Etapa 4 — Colocar a URL no site

Abra `js/config.js` e substitua:

```js
GOOGLE_SHEETS_WEB_APP_URL: "COLE_A_URL_DO_APPS_SCRIPT_AQUI"
```

por:

```js
GOOGLE_SHEETS_WEB_APP_URL: "https://script.google.com/macros/s/SEU_CODIGO/exec"
```

Mantenha as aspas.

## Etapa 5 — Atualizar o GitHub

Envie todos os arquivos e pastas desta versão ao repositório.

No GitHub Pages:

```text
Settings
→ Pages
→ Deploy from a branch
→ main
→ / (root)
```

Depois de o processo ficar verde em **Actions**, abra o site e pressione `Ctrl + F5`.

## Como conferir as respostas

### Google Planilhas

Abra a aba `Respostas`. Cada participante ocupará uma nova linha.

### Supabase

Abra:

```text
Table Editor
→ respostas_perfil_empreendedor
```

O site tenta enviar para os dois destinos configurados.

## Atenção

- Não publique uma Secret Key do Supabase.
- A Publishable Key pode ficar no navegador porque as permissões são limitadas pelas políticas RLS.
- Não apague ou renomeie o campo `identificador`, pois ele evita duplicações.
- Se criar uma nova implantação do Apps Script, atualize a URL no `js/config.js`.
