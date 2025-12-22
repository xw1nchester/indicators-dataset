from bs4 import BeautifulSoup
from pathlib import Path

def clean_html(html: str) -> str:
    soup = BeautifulSoup(html, "html.parser")

    # Remove <script> and <style> tags
    for tag in soup(["script", "style"]):
        tag.decompose()

    # Remove all attributes from all tags
    for tag in soup.find_all(True):
        tag.attrs = {}

    # Remove comments
    for comment in soup.find_all(
        string=lambda text: isinstance(text, type(soup.Comment))
    ):
        comment.extract()

    return str(soup)


def html_to_one_line(html: str) -> str:
    soup = BeautifulSoup(html, "lxml")
    return " ".join(soup.prettify().split())


dirty_dir = Path("../html/dirty")
cleaned_dir = Path("../html/cleaned")

# Создаём каталог, если его нет
cleaned_dir.mkdir(parents=True, exist_ok=True)

for html_file in dirty_dir.glob("*.html"):
    with html_file.open("r", encoding="utf-8") as f:
        contents = f.read()

    cleaned = html_to_one_line(clean_html(contents))

    output_file = cleaned_dir / html_file.name
    with output_file.open("w", encoding="utf-8") as f:
        f.write(cleaned)

    print(f"Обработан файл: {html_file.name}")