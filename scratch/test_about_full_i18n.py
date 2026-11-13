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
    report.fr_title = document.querySelector('.hero__title--about')?.textContent?.trim();
    report.fr_stat1 = document.querySelector('[data-i18n="about.statProjects"]')?.textContent;
    report.fr_progCat = document.querySelector('[data-i18n="about.catProgTitle"]')?.textContent;
    report.fr_langArabic = document.querySelector('[data-i18n="about.langArabic"]')?.textContent;
    report.fr_langArabicLevel = document.querySelector('[data-i18n="about.langArabicLevel"]')?.textContent;
    report.fr_expTitle = document.querySelector('[data-i18n="about.sfmTitle"]')?.textContent;
    report.fr_expB1 = document.querySelector('[data-i18n="about.sfmB1"]')?.textContent;
    report.fr_eduDesc = document.querySelector('[data-i18n="about.bacDesc"]')?.textContent;
    report.fr_footerPhone = document.querySelector('[data-i18n="footer.phoneLabel"]')?.textContent;
    
    // Switch to EN
    window.bmsSetLanguage('en');
    setTimeout(() => {
      report.en_title = document.querySelector('.hero__title--about')?.textContent?.trim();
      report.en_stat1 = document.querySelector('[data-i18n="about.statProjects"]')?.textContent;
      report.en_progCat = document.querySelector('[data-i18n="about.catProgTitle"]')?.textContent;
      report.en_langArabic = document.querySelector('[data-i18n="about.langArabic"]')?.textContent;
      report.en_langArabicLevel = document.querySelector('[data-i18n="about.langArabicLevel"]')?.textContent;
      report.en_expTitle = document.querySelector('[data-i18n="about.sfmTitle"]')?.textContent;
      report.en_expB1 = document.querySelector('[data-i18n="about.sfmB1"]')?.textContent;
      report.en_eduDesc = document.querySelector('[data-i18n="about.bacDesc"]')?.textContent;
      report.en_footerPhone = document.querySelector('[data-i18n="footer.phoneLabel"]')?.textContent;
      
      console.log('ABOUT_FULL_I18N_REPORT:' + JSON.stringify(report));
    }, 50);
  }, 50);
});
</script>
"""

with open("about.html", "r", encoding="utf-8") as f:
    orig = f.read()

temp_path = "temp_about_i18n_test.html"
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

print("=== ABOUT FULL I18N TEST ===")
for l in res.stderr.splitlines():
    if "ABOUT_FULL_I18N_REPORT" in l:
        print(l)

