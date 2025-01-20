from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import json
import asyncio
import torch
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
from IndicTransToolkit import IndicProcessor


app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store active connections
active_connections = []


# Initialize CUDA/CPU device
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Using device: {DEVICE}")

# Load models
model_indic_to_en = "ai4bharat/indictrans2-indic-en-1B"   # Indic → English
model_en_to_indic = "ai4bharat/indictrans2-en-indic-1B"   # English → Indic

# Initialize components
print("Loading tokenizers...")
tokenizer_indic_to_en = AutoTokenizer.from_pretrained(model_indic_to_en, trust_remote_code=True)
tokenizer_en_to_indic = AutoTokenizer.from_pretrained(model_en_to_indic, trust_remote_code=True)

print("Loading models...")
model_indic_to_en = AutoModelForSeq2SeqLM.from_pretrained(model_indic_to_en, trust_remote_code=True).to(DEVICE)
model_en_to_indic = AutoModelForSeq2SeqLM.from_pretrained(model_en_to_indic, trust_remote_code=True).to(DEVICE)

print("Initializing IndicProcessor...")
ip = IndicProcessor(inference=True)

# Dictionary of supported languages and their codes
SUPPORTED_LANGUAGES = {
    "Hindi": "hin_Deva",
    "Bengali": "ben_Beng",
    "Tamil": "tam_Taml",
    "Telugu": "tel_Telu",
    "Marathi": "mar_Deva",
    "English": "eng_Latn"
}

def validate_input(text):
    """Validate the input text"""
    if not text or not text.strip():
        return False, "Empty input text"
    if text.count('"') > 10:
        return False, "Invalid input: Too many quote marks"
    return True, "Valid input"

def split_text(text, max_tokens=250):
    """Split long text into smaller chunks for processing"""
    if not text:
        return []
    
    text = text.strip()
    if not text:
        return []
        
    words = text.split()
    chunks = []
    current_chunk = []
    
    for word in words:
        current_chunk.append(word)
        if len(" ".join(current_chunk)) > max_tokens:
            chunks.append(" ".join(current_chunk))
            current_chunk = []
    
    if current_chunk:
        chunks.append(" ".join(current_chunk))
    
    return chunks

async def translate_to_english_via_hindi(text: str, src_lang: str) -> dict:
    """
    Asynchronous version of the translation function.
    """
    try:
        # Input validation
        is_valid, message = validate_input(text)
        if not is_valid:
            raise ValueError(message)

        # Remove excessive whitespace and quotes
        text = ' '.join(text.split())
        text = text.replace('" "', ' ').replace('""', '"')
        
        # Skip Hindi translation if source is already Hindi
        if src_lang == "hin_Deva":
            hindi_text = text
        else:
            # First translation: Source language to Hindi
            chunks = split_text(text)
            if not chunks:
                raise ValueError("No valid text chunks to translate")
                
            hindi_chunks = []
            
            for chunk in chunks:
                batch = ip.preprocess_batch(
                    [chunk],
                    src_lang=src_lang,
                    tgt_lang="hin_Deva",
                )

                inputs = tokenizer_en_to_indic(
                    batch,
                    truncation=True,
                    padding="longest",
                    return_tensors="pt",
                    return_attention_mask=True,
                ).to(DEVICE)

                with torch.no_grad():
                    generated_tokens = model_en_to_indic.generate(
                        **inputs,
                        use_cache=True,
                        min_length=0,
                        max_length=256,
                        num_beams=5,
                        num_return_sequences=1,
                    )

                with tokenizer_en_to_indic.as_target_tokenizer():
                    generated_tokens = tokenizer_en_to_indic.batch_decode(
                        generated_tokens.detach().cpu().tolist(),
                        skip_special_tokens=True,
                        clean_up_tokenization_spaces=True,
                    )

                hindi_text = ip.postprocess_batch(generated_tokens, lang="hin_Deva")
                hindi_chunks.extend(hindi_text)

            hindi_text = " ".join(hindi_chunks)

        # Second translation: Hindi to English
        chunks = split_text(hindi_text)
        if not chunks:
            raise ValueError("Hindi translation produced no valid text")
            
        english_chunks = []

        for chunk in chunks:
            batch = ip.preprocess_batch(
                [chunk],
                src_lang="hin_Deva",
                tgt_lang="eng_Latn",
            )

            inputs = tokenizer_indic_to_en(
                batch,
                truncation=True,
                padding="longest",
                return_tensors="pt",
                return_attention_mask=True,
            ).to(DEVICE)

            with torch.no_grad():
                generated_tokens = model_indic_to_en.generate(
                    **inputs,
                    use_cache=True,
                    min_length=0,
                    max_length=256,
                    num_beams=5,
                    num_return_sequences=1,
                )

            with tokenizer_indic_to_en.as_target_tokenizer():
                generated_tokens = tokenizer_indic_to_en.batch_decode(
                    generated_tokens.detach().cpu().tolist(),
                    skip_special_tokens=True,
                    clean_up_tokenization_spaces=True,
                )

            english_text = ip.postprocess_batch(generated_tokens, lang="eng_Latn")
            english_chunks.extend(english_text)

        english_text = " ".join(english_chunks)

        # Validate outputs
        if not hindi_text.strip() or not english_text.strip():
            raise ValueError("Translation produced empty result")

        return {
            "status": "success",
            "data": {
                "original": text,
                "hindi": hindi_text,
                "english": english_text
            }
        }
    
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }


async def process_text(text: str) -> str:
    """
    Process the received text. Replace this with your actual processing logic.
    """
    # print("helllll")
    await asyncio.sleep(1)  # Simulate processing time
    return f"Processed: {text.upper()}"

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_connections.append(websocket)
    
    try:
        while True:
            # Receive message from client
            data = await websocket.receive_text()

            json_data = json.loads(data)

            # print ("data is :", json_data.get("text"))
            
            try:
                # Validate input data
                # if not isinstance(data, dict):
                #     raise ValueError("Invalid input format")
                # print("mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm")
                
                text = json_data.get("text")
                src_lang = json_data.get("language")
                html = json_data.get("html")

                # print("html: ", html)

                # print(text)
                # print(src_lang)

                code=""

                for lang, cs_cd in SUPPORTED_LANGUAGES.items():
                    # print(lang)
                    # print(cs_cd)
                    if lang == src_lang:
                     code = cs_cd

                # print ("code is: ", code)
                
                if not text or not src_lang or code=="":
                    raise ValueError("Missing required fields: 'text' and 'language'")
                
                if code=="":
                  raise ValueError(f"Unsupported language: {src_lang}")
                
                # Process the translation
                result = await translate_to_english_via_hindi(text, code)
                print("result is: ", result)
                
                # modify result such that there is one more variable name type called text
                result['type'] = "translation"
                # result = {'status': 'success', type:'translation', 'data': {'original': 'Hindi English', 'hindi': 'हिंदी अंग्रेज़ी ', 'english': 'Hindi English'}}

                # Send response back to client
                await websocket.send_json(result)


                # gemini call to get commands


                # await websocket.send_json(gemini response) type == command
                
            except Exception as e:
                error_response = {
                    "status": "error",
                    "message": str(e)
                }
                await websocket.send_json(error_response)

            # data = await websocket.receive_text()
            
            # try:
            #     # Process the received text
            #     processed_result = await process_text(data)
                
            #     # Send response back to client
            #     response = {
            #         "status": "success",
            #         "data": processed_result
            #     }
            #     await websocket.send_json(response)
                
            # except Exception as e:
            #     error_response = {
            #         "status": "error",
            #         "message": str(e)
            #     }
            #     await websocket.send_json(error_response)
                
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        # Remove connection when client disconnects
        if websocket in active_connections:
            active_connections.remove(websocket)

@app.get("/")
async def health_check():
    return {
        "status": "healthy",
        "supported_languages": SUPPORTED_LANGUAGES
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)