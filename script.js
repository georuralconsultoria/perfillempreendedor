// ===============================================
// CONFIGURAÇÃO DE COLETA COM SUPABASE
// Os dados ficam em config.js.
// Use somente a Publishable key no navegador.
// ===============================================
const {
  SUPABASE_URL = "",
  SUPABASE_PUBLISHABLE_KEY = ""
} = window.APP_CONFIG || {};

const SUPABASE_TABLE = "respostas_perfil_empreendedor";

const modal = document.getElementById("survey-modal");
const form = document.getElementById("survey-form");
const successScreen = document.getElementById("success-screen");
const formSteps = [...document.querySelectorAll(".form-step")];
const nextButton = document.getElementById("next-button");
const prevButton = document.getElementById("prev-button");
const submitButton = document.getElementById("submit-button");
const progressBar = document.getElementById("progress-bar");
const progressLabel = document.getElementById("progress-label");
const progressPercent = document.getElementById("progress-percent");
const formStatus = document.getElementById("form-status");
const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector(".nav");

let currentStep = 1;
const totalSteps = formSteps.length;
let lastFocusedElement = null;

// Atualiza automaticamente o ano.
const year = new Date().getFullYear();
document.getElementById("current-year").textContent = year;
document.getElementById("copyright-year").textContent = year;

// Menu móvel.
menuButton.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
});

nav.querySelectorAll("a, button").forEach((item) => {
  item.addEventListener("click", () => {
    nav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  });
});

// Abrir e fechar questionário.
document.querySelectorAll("[data-start]").forEach((button) => {
  button.addEventListener("click", openSurvey);
});

document.querySelectorAll("[data-close]").forEach((button) => {
  button.addEventListener("click", closeSurvey);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("open")) {
    closeSurvey();
  }
});

function openSurvey() {
  lastFocusedElement = document.activeElement;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  updateStep();
  modal.querySelector(".close-button").focus();
}

function closeSurvey() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  if (lastFocusedElement) lastFocusedElement.focus();
}

document.getElementById("finish-button").addEventListener("click", () => {
  closeSurvey();
  resetSurvey();
});

// Navegação entre etapas.
nextButton.addEventListener("click", () => {
  if (!validateStep(currentStep)) return;

  if (currentStep < totalSteps) {
    currentStep += 1;
    updateStep();
  }
});

prevButton.addEventListener("click", () => {
  if (currentStep > 1) {
    currentStep -= 1;
    updateStep();
  }
});

function updateStep() {
  formSteps.forEach((step, index) => {
    step.classList.toggle("active", index === currentStep - 1);
  });

  const percent = Math.round((currentStep / totalSteps) * 100);
  progressBar.style.width = `${percent}%`;
  progressLabel.textContent = `Etapa ${currentStep} de ${totalSteps}`;
  progressPercent.textContent = `${percent}%`;

  prevButton.disabled = currentStep === 1;
  nextButton.hidden = currentStep === totalSteps;
  submitButton.hidden = currentStep !== totalSteps;

  const panel = document.querySelector(".survey-panel");
  panel.scrollTo({ top: 0, behavior: "smooth" });

  const legend = formSteps[currentStep - 1].querySelector("legend");
  if (legend) legend.setAttribute("tabindex", "-1");
}

function validateStep(stepNumber) {
  const step = formSteps[stepNumber - 1];
  const requiredFields = [...step.querySelectorAll("[required]")];
  const validatedNames = new Set();
  let valid = true;
  let firstInvalid = null;

  clearStepErrors(step);

  requiredFields.forEach((field) => {
    const name = field.name;

    // Grupos de radio devem ser avaliados apenas uma vez.
    if (field.type === "radio") {
      if (validatedNames.has(name)) return;
      validatedNames.add(name);

      const checked = step.querySelector(`input[name="${CSS.escape(name)}"]:checked`);
      if (!checked) {
        valid = false;
        showError(name, "Selecione uma opção.");
        firstInvalid ||= field;
      }
      return;
    }

    if (field.type === "checkbox" && !field.checked) {
      valid = false;
      showError(name, "É necessário confirmar para continuar.");
      firstInvalid ||= field;
      return;
    }

    if (!field.value.trim()) {
      valid = false;
      showError(name, "Preencha este campo.");
      field.setAttribute("aria-invalid", "true");
      firstInvalid ||= field;
    }
  });

  if (!valid && firstInvalid) {
    firstInvalid.focus();
    formStatus.textContent = "Revise os campos destacados antes de continuar.";
  } else {
    formStatus.textContent = "";
  }

  return valid;
}

function showError(name, message) {
  const error = document.querySelector(`[data-error-for="${CSS.escape(name)}"]`);
  if (error) error.textContent = message;
}

function clearStepErrors(step) {
  step.querySelectorAll(".field-error").forEach((el) => (el.textContent = ""));
  step.querySelectorAll("[aria-invalid='true']").forEach((el) => el.removeAttribute("aria-invalid"));
}

// Atualização do controle de interesse.
const interestRange = document.getElementById("interesse_negocio");
const interestOutput = document.getElementById("range-output");
interestRange.addEventListener("input", () => {
  interestOutput.value = interestRange.value;
  interestOutput.textContent = interestRange.value;
});

// Contadores de caracteres.
document.querySelectorAll("textarea[maxlength]").forEach((textarea) => {
  const counter = document.querySelector(`[data-counter-for="${textarea.id}"]`);
  const updateCounter = () => {
    if (counter) counter.textContent = `${textarea.value.length}/${textarea.maxLength}`;
  };
  textarea.addEventListener("input", updateCounter);
  updateCounter();
});

// Envio.
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!validateStep(currentStep)) return;

  const submitOriginalText = submitButton.textContent;
  submitButton.disabled = true;
  submitButton.textContent = "Enviando...";
  formStatus.textContent = "";

  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());

  payload.data_envio = new Date().toISOString();
  payload.identificador = createAnonymousId();
  payload.indice_empreendedor = calculateScore(payload);

  try {
    if (isSupabaseConfigured()) {
      await sendToSupabase(payload);
      formStatus.textContent = "Respostas enviadas com sucesso.";
    } else {
      saveLocally(payload);
      formStatus.textContent =
        "Modo demonstração: configure o Supabase para receber respostas online.";
    }

    showResult(payload.indice_empreendedor);
  } catch (error) {
    console.error(error);
    formStatus.textContent =
      "Não foi possível enviar. Verifique a conexão, as chaves e as políticas do Supabase.";
    submitButton.disabled = false;
    submitButton.textContent = submitOriginalText;
  }
});

function isSupabaseConfigured() {
  return (
    SUPABASE_URL.startsWith("https://") &&
    !SUPABASE_URL.includes("COLE_A_") &&
    SUPABASE_PUBLISHABLE_KEY.length > 20 &&
    !SUPABASE_PUBLISHABLE_KEY.includes("COLE_A_")
  );
}

async function sendToSupabase(payload) {
  const projectUrl = SUPABASE_URL.replace(/\/+$/, "");
  const endpoint = `${projectUrl}/rest/v1/${SUPABASE_TABLE}`;
  const record = mapPayloadToDatabase(payload);

  const headers = {
    apikey: SUPABASE_PUBLISHABLE_KEY,
    "Content-Type": "application/json",
    Prefer: "return=minimal"
  };

  // Compatibilidade com a chave anon antiga. As novas Publishable keys
  // devem ser enviadas pelo cabeçalho apikey, sem Bearer.
  if (!SUPABASE_PUBLISHABLE_KEY.startsWith("sb_publishable_")) {
    headers.Authorization = `Bearer ${SUPABASE_PUBLISHABLE_KEY}`;
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify(record)
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Supabase ${response.status}: ${details}`);
  }
}

function mapPayloadToDatabase(payload) {
  const numberFields = [
    "interesse_negocio",
    "q_iniciativa",
    "q_criatividade",
    "q_planejamento",
    "q_comunicacao",
    "q_lideranca",
    "q_resiliencia",
    "q_oportunidades",
    "q_riscos",
    "indice_empreendedor"
  ];

  const record = {
    identificador: String(payload.identificador || ""),
    consentimento: payload.consentimento === "Sim",
    idade: String(payload.idade || "").trim(),
    curso: String(payload.curso || "").trim(),
    semestre: String(payload.semestre || "").trim(),
    turno: String(payload.turno || "").trim(),
    area_interesse: String(payload.area_interesse || "").trim(),
    experiencia_empreendedora: String(
      payload.experiencia_empreendedora || ""
    ).trim(),
    tipo_projeto: String(payload.tipo_projeto || "").trim(),
    habilidades: String(payload.habilidades || "").trim(),
    ideia_projeto: String(payload.ideia_projeto || "").trim() || null,
    apoio: String(payload.apoio || "").trim(),
    autoriza_uso_agregado: payload.autoriza_uso_agregado === "Sim"
  };

  numberFields.forEach((field) => {
    record[field] = Number(payload[field]);
  });

  return record;
}

function saveLocally(payload) {
  const key = "respostas_perfil_empreendedor";
  const current = JSON.parse(localStorage.getItem(key) || "[]");
  current.push(payload);
  localStorage.setItem(key, JSON.stringify(current));
}

function createAnonymousId() {
  if (crypto && crypto.randomUUID) return crypto.randomUUID();
  return `resp-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function calculateScore(payload) {
  const keys = [
    "q_iniciativa",
    "q_criatividade",
    "q_planejamento",
    "q_comunicacao",
    "q_lideranca",
    "q_resiliencia",
    "q_oportunidades",
    "q_riscos"
  ];

  const values = keys.map((key) => Number(payload[key] || 0));
  const total = values.reduce((sum, value) => sum + value, 0);
  const maximum = keys.length * 5;
  return Math.round((total / maximum) * 100);
}

function showResult(score) {
  form.hidden = true;
  document.querySelector(".progress-wrap").hidden = true;
  successScreen.hidden = false;

  const title = document.getElementById("profile-title");
  const description = document.getElementById("profile-description");
  const scoreText = document.getElementById("profile-score");
  const scoreBar = document.getElementById("score-bar");

  let profile;

  if (score >= 85) {
    profile = {
      title: "Perfil empreendedor protagonista",
      description:
        "Você demonstra forte iniciativa, visão de oportunidades, organização e capacidade de mobilizar pessoas. Continue transformando ideias em experiências práticas."
    };
  } else if (score >= 70) {
    profile = {
      title: "Perfil empreendedor em expansão",
      description:
        "Você apresenta competências empreendedoras consistentes e bom potencial para liderar projetos. Experiências práticas podem fortalecer ainda mais seu desenvolvimento."
    };
  } else if (score >= 50) {
    profile = {
      title: "Perfil empreendedor em desenvolvimento",
      description:
        "Você já possui habilidades importantes e pode ampliá-las com planejamento, participação em projetos, colaboração e contato com novas oportunidades."
    };
  } else {
    profile = {
      title: "Perfil explorador de possibilidades",
      description:
        "Seu caminho empreendedor está começando. Oficinas, projetos em equipe e pequenos desafios práticos podem ajudar você a reconhecer e desenvolver seus pontos fortes."
    };
  }

  title.textContent = profile.title;
  description.textContent = profile.description;
  scoreText.textContent = `${score}%`;

  requestAnimationFrame(() => {
    scoreBar.style.width = `${score}%`;
  });

  document.querySelector(".survey-panel").scrollTo({ top: 0, behavior: "smooth" });
}

function resetSurvey() {
  form.reset();
  form.hidden = false;
  successScreen.hidden = true;
  document.querySelector(".progress-wrap").hidden = false;
  currentStep = 1;
  interestOutput.textContent = "3";
  interestOutput.value = "3";
  document.querySelectorAll(".field-error").forEach((el) => (el.textContent = ""));
  document.querySelectorAll("textarea[maxlength]").forEach((textarea) => {
    const counter = document.querySelector(`[data-counter-for="${textarea.id}"]`);
    if (counter) counter.textContent = `0/${textarea.maxLength}`;
  });
  submitButton.disabled = false;
  submitButton.textContent = "Enviar respostas";
  formStatus.textContent = "";
  document.getElementById("score-bar").style.width = "0";
  updateStep();
}
