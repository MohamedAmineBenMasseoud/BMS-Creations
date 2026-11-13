import subprocess
import os

chrome = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

test_script = """
<script>
window.addEventListener('load', () => {
  const report = {};
  const wrapper = document.querySelector('.flip-words-wrapper');
  
  report.en_init_width = wrapper?.style?.width;
  
  window.bmsSetLanguage('fr');
  setTimeout(() => {
    report.fr_width = wrapper?.style?.width;
    
    window.bmsSetLanguage('en');
    setTimeout(() => {
      report.en_back_width = wrapper?.style?.width;
      console.log('WRAPPER_WIDTH_REPORT:' + JSON.stringify(report));
    }, 100);
  }, 100);
});
</script>
"""

with open("index.html", "r", encoding="utf-8") as f:
    orig = f.read()

temp_path = "temp_flip_width_test.html"
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

print("=== FLIP WRAPPER WIDTH TEST ===")
for l in res.stderr.splitlines():
    if "WRAPPER_WIDTH_REPORT" in l:
        print(l)

