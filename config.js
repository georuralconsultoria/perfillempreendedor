/**
 * CONFIGURAÇÃO DO SUPABASE
 *
 * 1. Crie o projeto no Supabase.
 * 2. Abra o arquivo "supabase-setup.sql" no SQL Editor e execute-o.
 * 3. No painel do Supabase, abra:
 *    Project Settings > API Keys
 * 4. Copie:
 *    - Project URL
 *    - Publishable key (começa normalmente com sb_publishable_)
 *
 * Nunca coloque uma Secret key ou service_role key neste arquivo.
 */
window.APP_CONFIG = {
  SUPABASE_URL: "https://rtllxyjtprhhaolrzkoa.supabase.co",
  SUPABASE_PUBLISHABLE_KEY: "sb_publishable_CwQpgkbV4dEvtId_m92dJw_ztmlGmNy"
};
console.log("Dados que serão enviados:", resposta);

const { error } = await supabaseClient
  .from("respostas_perfil_empreendedor")
  .insert([resposta]);

if (error) {
  console.error("ERRO COMPLETO DO SUPABASE:", error);

  alert(
    "Não foi possível enviar.\n\n" +
    "Mensagem: " + error.message + "\n" +
    "Código: " + (error.code || "não informado") + "\n" +
    "Detalhes: " + (error.details || "não informado") + "\n" +
    "Dica: " + (error.hint || "não informada")
  );

  return;
}

alert("Resposta enviada com sucesso!");
formulario.reset();
