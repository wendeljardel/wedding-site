# Wedding Site

Site do casamento, com lista de presentes serverless rodando 100% na AWS.

## O que tem aqui

| Pasta | O que faz |
|-------|-----------|
| `frontend/`  | SPA em React + Vite + Tailwind v4. Tres paginas publicas (Inicio, Cerimonia, Presentes) e uma admin. |
| `backend/`   | Lambdas em TypeScript que respondem `/api/*`. Empacotadas com esbuild. |
| `terraform/` | Infra como codigo (Terraform): DynamoDB, Lambdas, API Gateway HTTP API, S3 + CloudFront (OAC). |
| `infra/`     | `seed-gifts.json` com os presentes iniciais. |
| `scripts/`   | Utilitarios: `seed.ts` popula a tabela de presentes, `deploy-frontend.sh` sobe a SPA pro S3+CloudFront. |

## Arquitetura

```
navegador  -->  CloudFront  -->  S3 (SPA)
                          \->  API Gateway --> Lambda --> DynamoDB
```

- Hospedagem estatica em S3 + CloudFront.
- API serverless: API Gateway HTTP API + Lambda Node.js + DynamoDB on-demand.
- Reserva de presente e atomica (DynamoDB `ConditionExpression`).
- Nao ha login: o convidado digita o nome ao escolher o presente. Voce reconcilia depois pelo painel `/admin` (protegido por token).
- Cotas de lua de mel: convidado paga via Pix copia-e-cola gerado no navegador e clica em "ja paguei". A reconciliacao com o extrato bancario e manual no painel admin.

Custo estimado: US$ 1-3/mes durante os meses ativos, mais o dominio.

## Pre-requisitos

- Node.js 20+ (testado em 25)
- npm 10+
- AWS CLI configurado: `aws configure`
- Terraform 1.5+: <https://developer.hashicorp.com/terraform/install>
  - macOS: `brew install terraform`

## Instalando dependencias

```bash
npm --prefix frontend install
npm --prefix backend install
npm --prefix scripts install
```

## Configurando o Pix (cotas de lua de mel)

O modal de cotas gera o Pix copia-e-cola no proprio navegador. Pra isso,
copie `frontend/.env.example` pra `frontend/.env` e preencha:

```
VITE_PIX_KEY=sua-chave-aleatoria-do-banco
VITE_PIX_MERCHANT_NAME=THAMIRES E WENDEL
VITE_PIX_MERCHANT_CITY=SAO PAULO
```

Sem essas variaveis, o modal mostra um aviso amigavel pros convidados
ate voce configurar. A chave nunca passa pelo backend - ela vive no
bundle estatico do frontend. Recomendo usar **chave Pix aleatoria** do
seu banco (mais privada que CPF/email).

## Rodando localmente

```bash
npm --prefix frontend run dev
```

Abre <http://localhost:5173>. Quando a API nao esta acessivel (dev local), a
pagina de presentes cai automaticamente para dados de exemplo (modo demo), entao
da pra desenvolver a interface sem backend.

> Para exercitar a API de verdade, aponte o frontend para a API ja publicada.
> Copie a `api_url` dos outputs do Terraform e defina o proxy em
> `frontend/vite.config.ts` (ou teste direto pela `site_url` do CloudFront).

## Deploy

### 1. Infra + backend (Terraform)

Compile os Lambdas e aplique a infra. O Terraform empacota `backend/dist/handlers`
e cria DynamoDB, Lambdas, API Gateway, S3 e CloudFront.

```bash
npm --prefix backend run build

cd terraform
cp terraform.tfvars.example terraform.tfvars   # edite: admin_token = $(openssl rand -hex 32)
terraform init
terraform apply
```

Os outputs trazem `site_url` (endereco publico via CloudFront), `site_bucket_name`,
`distribution_id` e `api_url`. Guarde o `admin_token` que voce definiu
(precisa dele pra acessar `/admin`).

> A primeira criacao da distribuicao CloudFront leva ~5-15 min pra propagar.

Deploys seguintes do backend: `npm --prefix backend run build && terraform -chdir=terraform apply`.

### 2. Popular a tabela com presentes

Edite `infra/seed-gifts.json` com seus presentes reais, depois:

```bash
AWS_REGION=us-east-1 npm --prefix scripts run seed
```

### 3. Frontend

O bucket S3 privado e a distribuicao CloudFront (com OAC e o behavior `/api/*`
apontando pro API Gateway) ja sao criados pelo Terraform no passo 1. Basta subir
a SPA — o script descobre bucket e distribuicao pelos outputs do Terraform:

```bash
./scripts/deploy-frontend.sh
```

Depois abra a `site_url` dos outputs (algo como `https://xxxxxxxx.cloudfront.net`).

> Como o site e a API sao servidos pela mesma distribuicao CloudFront, nao ha
> CORS entre eles e a SPA continua chamando `/api` em caminho relativo.

### 4. Dominio (opcional)

Sem dominio proprio o site ja funciona pela URL `*.cloudfront.net`. Para usar um
dominio customizado:

- Registre o dominio no Route 53 (ou transfira de outro registrar) e crie a hosted zone.
- Crie um certificado no ACM em **us-east-1** (obrigatorio pro CloudFront).
- Adicione `aliases` + `viewer_certificate` (ACM) no recurso
  `aws_cloudfront_distribution` em `terraform/frontend.tf` e crie o registro
  A/AAAA (alias) no Route 53 apontando pro CloudFront.

## Como funciona o fluxo de reserva

1. Convidado abre a pagina de presentes e ve a lista.
2. Clica em "Vou dar este presente" -> modal pede o nome.
3. Frontend chama `POST /api/gifts/{id}/claim` com `{guestName}`.
4. Lambda executa `UpdateItem` no DynamoDB com `ConditionExpression status = 'available'`:
   - Se a condicao bate: grava `claimedBy = nome`, `claimedAt = now`, devolve `storeUrl`.
   - Se falha (alguem foi mais rapido): devolve 409 e o frontend avisa.
5. Frontend abre a loja em nova aba.
6. Voce abre `/admin` periodicamente, ve quem reservou cada presente e, se reconhecer algum nome estranho, clica em "liberar".

## Como funciona o fluxo de cota de lua de mel

1. Convidado abre `/presentes` e ve a secao "Lua de mel" no topo.
2. Clica numa cota (R$ 100 / R$ 120 / R$ 150 ou valor livre) -> modal pede o nome.
3. Frontend gera localmente um `txid` curto (ex: `LDM20260907ABC12`) e o BR Code do Pix.
4. Modal mostra o QR Code + texto copia-e-cola. Convidado paga no app do banco.
5. Convidado clica em "Ja paguei". Frontend chama `POST /api/honeymoon/claim`
   com `{cotaId, cotaLabel, amount, guestName, txid}` - Lambda grava em
   `wedding-honeymoon-claims` com `confirmed = false`.
6. Voce abre `/admin` -> aba "Lua de mel", confere cada `txid` no extrato
   Pix do banco e clica em "Pendente" pra marcar como confirmado.
   Avisos duplicados ou indevidos podem ser excluidos.

> O `txid` aparece como referencia da transacao em quase todos os bancos -
> e a chave que liga o aviso do site ao Pix recebido.

Pra editar os valores ou textos das cotas, mude `frontend/src/lib/honeymoon.ts`.

## Comandos uteis

| Comando | O que faz |
|---------|-----------|
| `npm --prefix frontend run dev` | Sobe Vite em <http://localhost:5173> |
| `npm --prefix frontend run build` | Build de producao em `frontend/dist` |
| `npm --prefix backend run typecheck` | Checa tipos sem gerar bundle |
| `npm --prefix backend run build` | Empacota os Lambdas em `backend/dist/handlers` |
| `terraform -chdir=terraform apply` | Cria/atualiza toda a infra na AWS |
| `terraform -chdir=terraform destroy` | Remove toda a infra |
| `npm --prefix scripts run seed` | Popula a tabela de presentes |
| `./scripts/deploy-frontend.sh` | Build + sync + invalidate da SPA |
