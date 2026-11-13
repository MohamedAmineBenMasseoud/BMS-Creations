import subprocess
import os

chrome = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

test_script = """
<script>
window.addEventListener('load', () => {
  const report = {};
  
  // Test FR
  window.bmsSetLanguage('fr');
  setTimeout(() => {
    report.fr_skip = document.querySelector('.skip-to-content')?.textContent;
    report.fr_flipWord1 = document.querySelector('[data-i18n="hero.flipWord1"]')?.textContent;
    report.fr_stickyProjects = document.querySelector('[data-i18n="hero.stickyProjects"]')?.textContent;
    report.fr_stickySnippet = document.querySelector('[data-i18n="hero.snippetProjects"]')?.textContent;
    report.fr_stickyLink = document.querySelector('[data-i18n="hero.linkProjects"]')?.textContent;
    report.fr_wCard0Title = document.querySelector('[data-i18n="hero.wCard0Title"]')?.textContent;
    report.fr_wCard0Snippet = document.querySelector('[data-i18n="hero.wCard0Snippet"]')?.textContent;
    report.fr_card1Title = document.querySelector('[data-i18n="hero.card1Title"]')?.textContent;
    report.fr_card1Badge = document.querySelector('[data-i18n="hero.card1Badge"]')?.textContent;
    report.fr_pillAi = document.querySelector('[data-i18n="hero.pillAi"]')?.textContent;
    report.fr_quoteHeading = document.querySelector('[data-i18n="hero.conversationHeading"]')?.textContent;
    report.fr_quote = document.querySelector('[data-i18n="hero.quoteText"]')?.textContent?.trim()?.slice(0, 30);
    report.fr_footerPhone = document.querySelector('[data-i18n="footer.phoneLabel"]')?.textContent;
    
    // Switch to EN
    window.bmsSetLanguage('en');
    setTimeout(() => {
      report.en_skip = document.querySelector('.skip-to-content')?.textContent;
      report.en_flipWord1 = document.querySelector('[data-i18n="hero.flipWord1"]')?.textContent;
      report.en_stickyProjects = document.querySelector('[data-i18n="hero.stickyProjects"]')?.textContent;
      report.en_stickySnippet = document.querySelector('[data-i18n="hero.snippetProjects"]')?.textContent;
      report.en_stickyLink = document.querySelector('[data-i18n="hero.linkProjects"]')?.textContent;
      report.en_wCard0Title = document.querySelector('[data-i18n="hero.wCard0Title"]')?.textContent;
      report.en_wCard0Snippet = document.querySelector('[data-i18n="hero.wCard0Snippet"]')?.textContent;
      report.en_card1Title = document.querySelector('[data-i18n="hero.card1Title"]')?.textContent;
      report.en_card1Badge = document.querySelector('[data-i18n="hero.card1Badge"]')?.textContent;
      report.en_pillAi = document.querySelector('[data-i18n="hero.pillAi"]')?.textContent;
      report.en_quoteHeading = document.querySelector('[data-i18n="hero.conversationHeading"]')?.textContent;
      report.en_quote = document.querySelector('[data-i18n="hero.quoteText"]')?.textContent?.trim()?.slice(0, 30);
      report.en_footerPhone = document.querySelector('[data-i18n="footer.phoneLabel"]')?.textContent;
      
      console.log('INDEX_FULL_I18N_REPORT:' + JSON.stringify(report));
    }, 50);
  }, 50);
});
</script>
"""

with open("index.html", "r", encoding="utf-8") as f:
    orig = f.read()

temp_path = "temp_index_i18n_test.html"
with open(temp_path, "w", encoding="utf-8") as f:
    f.write(orig.replace("</body>", test_script + "</body>"))

cmd = [
    chrome,
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--dump-dom",
    "--enable-logging=stderr",
    "--virtual-time-budget=2000",
    f"file:///{os.path.abspath(temp_path).replace(os.sep, '/')}"
]
res = subprocess.run(cmd, capture_output=True, text=True)
os.remove(temp_path)

print("=== INDEX FULL I18N TEST ===")
for l in res.stderr.splitlines():
    if "INDEX_FULL_I18N_REPORT" in l:
        print(l)

