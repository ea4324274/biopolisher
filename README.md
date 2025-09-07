# Bio Polisher (Revana)

A minimal Node/Express API that rewrites therapist bios into client-friendly copy using OpenAI.
Deploy on Render; call from your Revana page via fetch.

## Endpoints

- `POST /api/polish-bio`
  - Body (JSON):
    ```json
    {
      "bio": "string (required)",
      "tone": "Warm & Compassionate | Professional & Trustworthy | Inspirational & Empowering",
      "short": true
    }
    ```
  - Response:
    ```json
    { "output": "Polished bio text..." }
    ```

- `GET /healthz` -> returns `ok`

## Deploy on Render

1. **Fork or push** this repo to your GitHub.
2. In Render:
   - **New → Web Service** → Connect this repo.
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
3. **Env Vars**:
   - `OPENAI_API_KEY` = your key
   - `ALLOWED_ORIGINS` = comma-separated list of domains allowed for CORS  
     e.g. `https://revana.io,https://www.revana.io`
4. Deploy → note your base URL, e.g. `https://bio-polisher.onrender.com`

## Frontend usage (example)

```html
<script>
async function polish(payload) {
  const res = await fetch("https://YOUR-RENDER-URL/api/polish-bio", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return res.json();
}
</script>
```

## Security notes
- Keep your OpenAI API key **server-side only**.
- Restrict CORS via `ALLOWED_ORIGINS`.
- Consider adding basic rate limiting (e.g., `express-rate-limit`) if you expose it publicly.

## License
MIT
