# notion-to-md as a Function

notion-to-md function is a simple Cloud Run function that wraps the [notion-to-md](https://github.com/souvikinator/notion-to-md) package.

## Environment Variables

* Required
  * `NOTION_API_KEY`

## Deployment

Clone this repository and deploy it to Cloud Run functions. Example:

```bash
FUNCTION_NAME=notion-to-md
REGION=asia-northeast1
SECRET=notion-api-key

gcloud functions deploy "$FUNCTION_NAME" \
  --gen2 \
  --runtime=nodejs20 \
  --region="$REGION" \
  --source=. \
  --entry-point=notionToMd \
  --trigger-http \
  --set-secrets=NOTION_API_KEY="${SECRET}:latest"
```

## Usage

```bash
FUNCTION_URL=$(gcloud functions describe "$FUNCTION_NAME" --region="$REGION" --format="value(url)")
ACCESS_TOKEN=$(gcloud auth print-identity-token)
curl -X POST "$FUNCTION_URL" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"id": "your-page-id"}'
```
