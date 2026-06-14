/* =========================================================
   CONFIGURAÇÃO DOS DESTINOS DAS RESPOSTAS

   O site pode enviar para:
   1. Supabase;
   2. Google Planilhas por meio do Apps Script.

   Use somente a Publishable Key do Supabase.
   Nunca use Secret Key ou service_role aqui.
========================================================= */

window.APP_CONFIG = {
  SUPABASE_URL: "https://rtllxyjtprhhaolrzkoa.supabase.co",
  SUPABASE_PUBLISHABLE_KEY: "sb_publishable_CwQpgkbV4dEvtId_m92dJw_ztmlGmNy",

  // Cole aqui a URL terminada em /exec, gerada ao publicar o Apps Script.
  GOOGLE_SHEETS_WEB_APP_URL: "COLE_A_URL_DO_APPS_SCRIPT_AQUI"
};
