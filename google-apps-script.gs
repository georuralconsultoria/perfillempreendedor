/**
 * PERFIL DO ESTUDANTE EMPREENDEDOR — UEFS
 * Integração do site com Google Planilhas.
 *
 * Este código deve ser colado em:
 * Google Planilhas > Extensões > Apps Script
 *
 * Depois, publique como App da Web:
 * - Executar como: você
 * - Quem pode acessar: qualquer pessoa
 */

const SHEET_NAME = "Respostas";

const HEADERS = [
  "Data de envio",
  "Identificador anônimo",
  "Consentimento",
  "Faixa etária",
  "Curso",
  "Semestre/período",
  "Turno",
  "Área de interesse profissional",
  "Experiência empreendedora",
  "Interesse em criar negócio (1-5)",
  "Tipo de negócio ou projeto",
  "Iniciativa",
  "Criatividade",
  "Planejamento",
  "Comunicação",
  "Liderança",
  "Resiliência",
  "Visão de oportunidades",
  "Avaliação de riscos",
  "Habilidades",
  "Ideia de negócio ou projeto",
  "Apoio desejado",
  "Autoriza uso agregado",
  "Índice empreendedor (%)"
];

function doGet() {
  return jsonResponse({
    success: true,
    message: "Integração do questionário com Google Planilhas ativa."
  });
}

function doPost(e) {
  const lock = LockService.getScriptLock();

  try {
    lock.waitLock(15000);

    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("Nenhum conteúdo recebido.");
    }

    const data = JSON.parse(e.postData.contents);
    validatePayload(data);

    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
    }

    prepareHeader(sheet);

    // Evita duplicação quando o participante tenta enviar novamente.
    const identifier = sanitize(data.identificador);
    if (identifierAlreadyExists(sheet, identifier)) {
      return jsonResponse({
        success: true,
        duplicate: true,
        message: "Resposta já registrada anteriormente."
      });
    }

    const sentAt = data.data_envio
      ? new Date(data.data_envio)
      : new Date();

    const row = [
      sentAt,
      identifier,
      data.consentimento === "Sim" ? "Sim" : "Não",
      sanitize(data.idade),
      sanitize(data.curso),
      sanitize(data.semestre),
      sanitize(data.turno),
      sanitize(data.area_interesse),
      sanitize(data.experiencia_empreendedora),
      numberBetween(data.interesse_negocio, 1, 5),
      sanitize(data.tipo_projeto),
      numberBetween(data.q_iniciativa, 1, 5),
      numberBetween(data.q_criatividade, 1, 5),
      numberBetween(data.q_planejamento, 1, 5),
      numberBetween(data.q_comunicacao, 1, 5),
      numberBetween(data.q_lideranca, 1, 5),
      numberBetween(data.q_resiliencia, 1, 5),
      numberBetween(data.q_oportunidades, 1, 5),
      numberBetween(data.q_riscos, 1, 5),
      sanitize(data.habilidades),
      sanitize(data.ideia_projeto),
      sanitize(data.apoio),
      data.autoriza_uso_agregado === "Sim" ? "Sim" : "Não",
      numberBetween(data.indice_empreendedor, 0, 100)
    ];

    sheet.appendRow(row);

    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1).setNumberFormat("dd/mm/yyyy hh:mm:ss");
    sheet.getRange(lastRow, 1, 1, HEADERS.length).setWrap(true);

    return jsonResponse({
      success: true,
      message: "Resposta registrada na planilha."
    });
  } catch (error) {
    return jsonResponse({
      success: false,
      message: String(error)
    });
  } finally {
    try {
      lock.releaseLock();
    } catch (_) {}
  }
}

function prepareHeader(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  }

  const header = sheet.getRange(1, 1, 1, HEADERS.length);

  header
    .setFontWeight("bold")
    .setFontColor("#FFFFFF")
    .setBackground("#1565C0")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle")
    .setWrap(true);

  sheet.setFrozenRows(1);

  if (sheet.getFilter()) {
    sheet.getFilter().remove();
  }

  if (sheet.getLastRow() >= 1) {
    sheet
      .getRange(1, 1, Math.max(sheet.getLastRow(), 2), HEADERS.length)
      .createFilter();
  }
}

function identifierAlreadyExists(sheet, identifier) {
  if (!identifier || sheet.getLastRow() < 2) return false;

  const result = sheet
    .getRange(2, 2, sheet.getLastRow() - 1, 1)
    .createTextFinder(identifier)
    .matchEntireCell(true)
    .findNext();

  return Boolean(result);
}

function validatePayload(data) {
  if (!data.identificador) {
    throw new Error("Identificador ausente.");
  }

  if (data.consentimento !== "Sim") {
    throw new Error("Consentimento não confirmado.");
  }

  const requiredTextFields = [
    "idade",
    "curso",
    "semestre",
    "turno",
    "area_interesse",
    "experiencia_empreendedora",
    "tipo_projeto",
    "habilidades",
    "apoio"
  ];

  requiredTextFields.forEach(function(field) {
    if (!String(data[field] || "").trim()) {
      throw new Error("Campo obrigatório ausente: " + field);
    }
  });
}

function sanitize(value) {
  if (value === null || value === undefined) return "";

  const text = String(value).trim();

  // Evita que entradas sejam interpretadas como fórmulas.
  if (/^[=+\-@]/.test(text)) {
    return "'" + text;
  }

  return text;
}

function numberBetween(value, min, max) {
  const number = Number(value);

  if (!Number.isFinite(number) || number < min || number > max) {
    throw new Error("Valor numérico inválido.");
  }

  return number;
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
