import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

hf_token = os.getenv("HF_TOKEN")

client = OpenAI(
    base_url="https://router.huggingface.co/v1",
    api_key=os.getenv("HF_TOKEN"),
)

with open("../html/cleaned/accounts.html", "r", encoding="utf-8") as file:
    contents = file.read()

# Если его определить невозможно — выведи строку None.
prompt = f'Найди в этом HTML элемент с текстом "Валовой региональный продукт“. В ответе выведи только полный XPath без пояснений. XPath не должен привязываться к текстовому значению. HTML: {contents}'

completion = client.chat.completions.create(
    model="openai/gpt-oss-120b:groq",
    messages=[
        {
            "role": "user",
            "content": prompt
        }
    ],
)

# /html/body/main/section/div/div/div/div/div/div/div/div/div/div/div/a/div[1]
print(completion.choices[0].message.content)