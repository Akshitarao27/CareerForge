
import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

API_KEY = os.getenv("AICREDITS_API_KEY")
BASE_URL = os.getenv(
    "AICREDITS_BASE_URL",
    "https://api.aicredits.in/v1",
)
MODEL = os.getenv(
    "AICREDITS_MODEL",
    "openai/gpt-4o-mini",
)


def get_ai_client():
    """Create the AI client only when needed."""
    if not API_KEY:
        raise RuntimeError(
            "AICREDITS_API_KEY is missing from the .env file."
        )

    return OpenAI(
        api_key=API_KEY,
        base_url=BASE_URL,
        max_retries=0,
        timeout=30.0,
    )


def generate_ai_response(
    system_prompt: str,
    user_prompt: str,
    max_tokens: int = 250,
) -> str:
    """Generate a short AI response."""
    client = get_ai_client()

    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        max_tokens=max_tokens,
    )

    return response.choices[0].message.content or ""
