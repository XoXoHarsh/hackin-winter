import requests
import json
from typing import Dict
import re

class BrowserCommandProcessor:
    def __init__(self, api_key: str):
        self.api_key = "AIzaSyAtiPcCbK35oYxVIy0PlYgOs4HQrMeZdLQ"
        self.base_url = "https://generativelanguage.googleapis.com/v1beta/models"
        self.model = "gemini-1.5-flash"

    def extract_json_from_response(self, text: str) -> str:
        json_match = re.search(r'```(?:json)?\s*(.*?)\s*```', text, re.DOTALL)
        if json_match:
            return json_match.group(1)
        return text

    def process_command(self, html_content: str, user_intention: str) -> Dict:
        try:
            url = f"{self.base_url}/{self.model}:generateContent?key={self.api_key}"
            
            # Updated prompt with explicit argument requirements and examples
            payload = {
                "contents": [{
                    "parts": [{
                        "text": f"""
Analyze this HTML content and user intention, then return a JSON object with the appropriate action and required arguments.
HTML content:
{html_content}

User intention: {user_intention}

Return ONLY a JSON object following these exact formats for each action type:

For clicking elements:
{{"action": "clickOnElement", "arguments": {{"id": "element-id"}} }} OR
{{"action": "clickOnElement", "arguments": {{"className": "element-class"}} }}

For typing text:
{{"action": "typeOnTheInputBox", "arguments": {{"className": "input-class", "text": "text to type"}} }}

For opening new tabs:
{{"action": "openNewTab", "arguments": {{"url": "full-url-here"}} }}

For scrolling:
{{"action": "scrollDown"}} or {{"action": "scrollUp"}}

For navigation:
{{"action": "goBack"}} or {{"action": "goForward"}} or {{"action": "reloadPage"}} or {{"action": "closeTab"}}

Do not include any explanation or markdown formatting - return only the JSON object."""
                    }]
                }]
            }
            
            headers = {"Content-Type": "application/json"}
            
            response = requests.post(url=url, headers=headers, json=payload)
            response.raise_for_status()
            
            result = response.json()
            
            try:
                command_text = result['candidates'][0]['content']['parts'][0]['text']
                clean_json_text = self.extract_json_from_response(command_text)
                command = json.loads(clean_json_text)
                return self.validate_command(command)
            except (KeyError, json.JSONDecodeError) as e:
                return {
                    "error": f"Failed to parse command: {str(e)}",
                    "raw_response": result
                }
                
        except requests.exceptions.RequestException as e:
            return {
                "error": f"API request failed: {str(e)}",
                "status_code": getattr(e.response, 'status_code', None)
            }
    
    def validate_command(self, command: Dict) -> Dict:
        valid_actions = {
            "scrollDown": [],
            "scrollUp": [],
            "clickOnElement": ["id", "className"],
            "goBack": [],
            "goForward": [],
            "reloadPage": [],
            "openNewTab": ["url"],
            "closeTab": [],
            "typeOnTheInputBox": ["className", "text"]
        }
        
        if "action" not in command:
            return {"error": "No action specified in command"}
            
        action = command["action"]
        if action not in valid_actions:
            return {"error": f"Invalid action: {action}"}
            
        required_args = valid_actions[action]
        if required_args:
            if "arguments" not in command:
                return {"error": f"Missing required arguments for action: {action}"}
                
            if action == "clickOnElement":
                if not ("id" in command["arguments"] or "className" in command["arguments"]):
                    return {"error": "clickOnElement requires either id or className"}
            else:
                missing_args = [arg for arg in required_args if arg not in command["arguments"]]
                if missing_args:
                    return {"error": f"Missing required arguments: {', '.join(missing_args)}"}
        
        return command

# def main():
#     # Replace with your actual API key
#     api_key = "AIzaSyAtiPcCbK35oYxVIy0PlYgOs4HQrMeZdLQ"
#     processor = BrowserCommandProcessor(api_key)
    
#     # Example HTML content
#     html_content = """
#     <div class="container">
#         <button id="submit-btn" class="primary-button">Submit</button>
#         <input type="text" class="search-input" placeholder="Search...">
#         <a href="https://example.com" class="link">Example Link</a>
#     </div>
#     """
    
#     # Test one case at a time to see the full response
#     # give more test cases
#     intention = "open youtube"


#     print(f"\nProcessing intention: {intention}")
#     result = processor.process_command(html_content, intention)
#     print("Result:")
#     print(json.dumps(result, indent=2))

# if __name__ == "__main__":
#     main()

def get_command_from_html(html_content: str, user_intention: str) -> Dict:
    processor = BrowserCommandProcessor("AIzaSyAtiPcCbK35oYxVIy0PlYgOs4HQrMeZdLQ")
    return processor.process_command(html_content, user_intention)

# test one case  example
# html_content = """

# <div class="container">
#     <button id="submit-btn" class="primary-button">Submit</button>
#     <input type="text" class="search-input" placeholder="Search...">
#     <a href="https://example.com" class="link">Example Link</a>
# </div>

# """
# user_intention = "open youtube"
# print(get_command_from_html(html_content, user_intention))