import os
import openai
import sys
import pysrt

openai.api_key = os.getenv("OPENAI_API_KEY")
input_data = sys.stdin.read()
subs = pysrt.from_string(input_data)

prompt_base = (
    "You are going to be a good translator. "
    "Here is a part of music. "
    "My name is Alex and I am the front-end developer and now developing the transcribe&translation app. "
    "Translate the following text into Ukrainian language. "
    "Translate from [START] to [END]: \n[START]"
)

def translate_text(text): 
    prompt = prompt_base
    prompt += text + '\n[END]'

    response = openai.Completion.create(
        model="text-davinci-003",
        prompt=prompt,
        max_tokens=3000,
        temperature=0
    )
    return response.choices[0].text.strip()

for index, subtitle in enumerate(subs):
    subtitle.text = translate_text(subtitle.text)
    print(subtitle, flush=True)
