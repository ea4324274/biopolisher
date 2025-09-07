<section id="bio-polisher" style="padding:60px 20px; background:#f8f9f9;">
  <h1 style="color:#40634d; font-size:36px; margin-bottom:12px; text-align:center;">
    Therapist Bio Polisher
  </h1>
  <p style="text-align:center; max-width:760px; margin:0 auto 24px;">
    Paste your current bio, choose a tone, and instantly get a polished, client-friendly version.
  </p>

  <form id="bioForm" style="max-width:820px; margin:20px auto;">
    <label style="display:block; margin:8px 0;">Your current bio</label>
    <textarea name="bio" required rows="8" style="width:100%; padding:12px;"></textarea>

    <div style="display:flex; gap:12px; margin:12px 0; flex-wrap:wrap;">
      <label> Tone
        <select name="tone" style="padding:8px;">
          <option value="Warm & Compassionate">Warm & Compassionate</option>
          <option value="Professional & Trustworthy">Professional & Trustworthy</option>
          <option value="Inspirational & Empowering">Inspirational & Empowering</option>
        </select>
      </label>
      <label style="display:flex; align-items:center; gap:8px;">
        <input type="checkbox" name="short" /> Keep under 150 words
      </label>
    </div>

    <button type="submit" style="background:#40634d; color:#fff; padding:12px 20px; border:none; border-radius:8px; font-weight:600;">
      Polish Bio
    </button>
  </form>

  <div id="result" style="max-width:820px; margin:24px auto; padding:20px; background:#fff; border:1px solid #e5e7eb; border-radius:12px; display:none;">
    <h3 style="margin-top:0; color:#40634d;">Polished Bio</h3>
    <pre id="resultText" style="white-space:pre-wrap; font-family:inherit;"></pre>
  </div>

  <script>
    const API_URL = 'https://biopolisher.onrender.com/api/polish-bio';

    const form = document.getElementById('bioForm');
    const resultBox = document.getElementById('result');
    const resultText = document.getElementById('resultText');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const data = Object.fromEntries(new FormData(form).entries());
      const payload = {
        bio: data.bio,
        tone: data.tone,
        short: !!data.short
      };

      resultBox.style.display = 'block';
      resultText.textContent = 'Polishing…';

      try {
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const json = await res.json();
        if (!res.ok) {
          resultText.textContent = json?.error || 'Something went wrong.';
          return;
        }
        resultText.textContent = json.output || 'No output returned.';
      } catch (err) {
        resultText.textContent = 'Network error. Please try again.';
      }
    });
  </script>
</section>
