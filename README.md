# Wedding Site

Site do casamento, com lista de presentes serverless rodando 100% na AWS.

## O que tem aqui

| Pasta | O que faz |
|-------|-----------|
| `frontend/` | SPA em React + Vite + Tailwind v4. Tres paginas publicas (Inicio, Cerimonia, Presentes) e uma admin. |
| `backend/`  | Lambdas em TypeScript que respondem `/api/*`. Empacotadas com esbuild. |
| `infra/`    | Template AWS SAM com DynamoDB, API Gateway HTTP API e Lambdas. |
| `scripts/`  | Utilitarios: `seed.ts` popula a tabela de presentes, `deploy-frontend.sh` sobe a SPA pro S3+CloudFront. |

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
- AWS SAM CLI: <https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html>
  - macOS: `brew install aws-sam-cli`

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

Em dois terminais separados:

```bash
# Terminal 1 - backend (SAM local emula API Gateway + Lambda)
cd infra
sam build
sam local start-api --port 3000

# Terminal 2 - frontend (Vite com proxy de /api -> :3000)
npm --prefix frontend run dev
```

Abre <http://localhost:5173>. Se a API local nao estiver no ar, a pagina de presentes mostra dados de exemplo (modo demo).

> Dica: pra rodar offline mesmo sem o SAM, basta `npm --prefix frontend run dev`. O frontend detecta a falha da API e cai pro mock.

## Deploy

### 1. Backend (primeira vez)

```bash
cd infra
sam build
sam deploy --guided \
  --parameter-overrides AdminToken=$(openssl rand -hex 32)
```

Anote o `ApiUrl` do output e o `AdminToken` que voce gerou (precisa dele pra acessar `/admin`).

Deploys seguintes: `sam build && sam deploy`.

### 2. Popular a tabela com presentes

Edite `infra/seed-gifts.json` com seus presentes reais, depois:

```bash
AWS_REGION=sa-east-1 npm --prefix scripts run seed
```

### 3. Frontend

Crie um bucket S3 privado e uma distribuicao CloudFront apontando pra ele
(via console AWS ou Terraform/CDK). Configure o behavior `/api/*` pra
direcionar ao API Gateway criado pelo SAM. Depois:

```bash
export S3_BUCKET=meu-bucket
export CLOUDFRONT_DISTRIBUTION_ID=E123ABC456
./scripts/deploy-frontend.sh
```

### 4. Dominio

- Registre o dominio no Route 53 (ou transfira de outro registrar) e crie a hosted zone.
- Crie um certificado no ACM em **us-east-1** (obrigatorio pro CloudFront).
- Aponte a distribuicao CloudFront pro certificado e adicione o alias A no Route 53.

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
| `sam local start-api` (em `infra/`) | Emula a API no <http://localhost:3000> |
| `sam deploy` (em `infra/`) | Deploy do backend e da infra |
| `npm --prefix scripts run seed` | Popula a tabela de presentes |
| `./scripts/deploy-frontend.sh` | Build + sync + invalidate da SPA |
