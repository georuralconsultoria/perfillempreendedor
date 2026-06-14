-- ==========================================================
-- PERFIL DO ESTUDANTE EMPREENDEDOR — CONFIGURAÇÃO SUPABASE
-- Execute todo este arquivo no SQL Editor do Supabase.
-- ==========================================================

create extension if not exists pgcrypto;

create table if not exists public.respostas_perfil_empreendedor (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  identificador text not null
    check (char_length(identificador) between 10 and 100),

  consentimento boolean not null
    check (consentimento = true),

  idade varchar(30) not null,
  curso varchar(100) not null
    check (char_length(btrim(curso)) between 1 and 100),
  semestre varchar(40) not null,
  turno varchar(40) not null,
  area_interesse varchar(150) not null
    check (char_length(btrim(area_interesse)) between 1 and 150),

  experiencia_empreendedora varchar(120) not null,
  interesse_negocio smallint not null
    check (interesse_negocio between 1 and 5),
  tipo_projeto varchar(120) not null,

  q_iniciativa smallint not null check (q_iniciativa between 1 and 5),
  q_criatividade smallint not null check (q_criatividade between 1 and 5),
  q_planejamento smallint not null check (q_planejamento between 1 and 5),
  q_comunicacao smallint not null check (q_comunicacao between 1 and 5),
  q_lideranca smallint not null check (q_lideranca between 1 and 5),
  q_resiliencia smallint not null check (q_resiliencia between 1 and 5),
  q_oportunidades smallint not null check (q_oportunidades between 1 and 5),
  q_riscos smallint not null check (q_riscos between 1 and 5),

  habilidades varchar(500) not null
    check (char_length(btrim(habilidades)) between 1 and 500),
  ideia_projeto varchar(700),
  apoio varchar(120) not null,
  autoriza_uso_agregado boolean not null default false,

  indice_empreendedor smallint not null
    check (indice_empreendedor between 0 and 100)
);

comment on table public.respostas_perfil_empreendedor is
  'Respostas confidenciais do questionário acadêmico Perfil do Estudante Empreendedor.';

-- Ativa a proteção por linha.
alter table public.respostas_perfil_empreendedor enable row level security;

-- Remove permissões amplas que possam existir.
revoke all on table public.respostas_perfil_empreendedor from anon;
revoke all on table public.respostas_perfil_empreendedor from authenticated;

-- O site público pode somente inserir. Não pode listar, alterar ou apagar.
grant insert on table public.respostas_perfil_empreendedor to anon;

drop policy if exists "Permitir envio publico do questionario"
on public.respostas_perfil_empreendedor;

create policy "Permitir envio publico do questionario"
on public.respostas_perfil_empreendedor
for insert
to anon
with check (
  consentimento = true
  and interesse_negocio between 1 and 5
  and q_iniciativa between 1 and 5
  and q_criatividade between 1 and 5
  and q_planejamento between 1 and 5
  and q_comunicacao between 1 and 5
  and q_lideranca between 1 and 5
  and q_resiliencia between 1 and 5
  and q_oportunidades between 1 and 5
  and q_riscos between 1 and 5
  and indice_empreendedor between 0 and 100
);

-- Não são criadas políticas de SELECT, UPDATE ou DELETE.
-- Portanto, a chave pública do site não consegue ler ou modificar respostas.
