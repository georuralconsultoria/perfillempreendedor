# Perfil do Estudante Empreendedor — versão Supabase

Esta versão envia as respostas do questionário para um banco PostgreSQL no Supabase.

## Segurança aplicada

O arquivo `supabase-setup.sql` configura:

- Row Level Security (RLS);
- acesso público somente para `INSERT`;
- nenhuma permissão pública para visualizar, editar ou excluir respostas;
- validações de tamanho e valores no próprio banco;
- identificador anônimo, sem exigir nome, CPF ou endereço.

A `Publishable key` pode ficar no site porque possui privilégios reduzidos e depende das políticas RLS. Nunca coloque uma `Secret key` ou `service_role key` em arquivos públicos.

## 1. Criar o projeto

1. Entre no Supabase e crie um novo projeto.
2. Defina um nome e uma senha forte para o banco.
3. Aguarde o projeto ficar disponível.

## 2. Criar a tabela e as políticas

1. No painel do projeto, abra **SQL Editor**.
2. Clique em **New query**.
3. Copie todo o conteúdo de `supabase-setup.sql`.
4. Cole no editor e clique em **Run**.
5. Abra **Table Editor** e confirme que a tabela
   `respostas_perfil_empreendedor` foi criada.

## 3. Obter a URL e a chave pública

1. Abra **Project Settings > API Keys**.
2. Copie a **Project URL**.
3. Copie a **Publishable key**, normalmente iniciada por
   `sb_publishable_`.
4. Não copie a Secret key.

## 4. Configurar o site

Abra `config.js` e substitua:

```js
window.APP_CONFIG = {
  SUPABASE_URL: "COLE_A_PROJECT_URL_AQUI",
  SUPABASE_PUBLISHABLE_KEY: "COLE_A_PUBLISHABLE_KEY_AQUI"
};
```

Depois salve o arquivo.

## 5. Testar

Use um servidor local, pois abrir apenas pelo caminho `file://` pode causar limitações em alguns navegadores.

### Com VS Code

1. Instale a extensão **Live Server**.
2. Clique com o botão direito em `index.html`.
3. Escolha **Open with Live Server**.
4. Preencha e envie o questionário.
5. No Supabase, abra **Table Editor** e confira a nova linha.

Enquanto `config.js` não estiver preenchido, o formulário funciona em modo demonstração e salva as respostas apenas no navegador.

## 6. Publicar no GitHub Pages

1. Crie um repositório público no GitHub.
2. Envie todos os arquivos desta pasta.
3. Abra **Settings > Pages**.
4. Em **Build and deployment**, escolha:
   - Source: `Deploy from a branch`;
   - Branch: `main`;
   - Folder: `/ (root)`.
5. Salve.

A Publishable key pode aparecer no código público. A proteção real é feita pelas políticas RLS. A Secret key nunca deve ser publicada.

## 7. Consultar e exportar respostas

No painel do Supabase:

1. Abra **Table Editor**.
2. Selecione `respostas_perfil_empreendedor`.
3. Use filtros ou ordenação.
4. Para exportar, utilize a opção de exportação CSV disponível na interface.

## 8. Personalização

No `index.html`, substitua:

- `Nome da Instituição`;
- `pesquisa@instituicao.edu.br`;
- `(00) 00000-0000`.

Para usar a logo oficial, substitua `assets/logo.svg` mantendo o mesmo nome, ou altere o caminho no HTML.

## Observações importantes

- Não torne a tabela publicamente legível.
- Restrinja o acesso ao painel do Supabase à equipe responsável.
- Defina por quanto tempo os dados serão mantidos.
- Informe aos participantes um contato para dúvidas sobre a pesquisa.
- Antes da aplicação, valide o texto de consentimento com o professor ou orientador.
- Um formulário público ainda pode receber spam. Para uma aplicação de grande escala, considere adicionar CAPTCHA e limitação de envios por uma função de servidor.
