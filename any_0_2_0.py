import os
import openai
from flask import Flask, request, jsonify
from dotenv import load_dotenv

app = Flask(__name__)

# OpenAI APIキーを設定（独自モデルを作るまではGPT-4を使用）
load_dotenv()  # .envファイルを読み込む
API_KEY = os.getenv("OPENAI_API_KEY")  # 環境変数からAPIキーを取得
openai.api_key = API_KEY  # ここでAPIキーをセット

@app.route('/chat', methods=['POST'])
def chat():
    try:
        # JSONリクエストを取得
        data = request.get_json()
        if not data or "message" not in data:
            return jsonify({"error": "Invalid JSON format. Please send a valid JSON with a 'message' key."}), 400
        
        user_message = data["message"]
        
        # エニーのキャラクター設定
        system_prompt = """
        あなたはエニーです。7歳の少女のように元気で、なんでも知っていて何でもできる存在です。
        ユーザーに楽しくわかりやすく会話してください。
        
        ユーザーの質問に対して、エニーバースの概念を元に説明してください。
        
        例えば：
        - "エニーバースってなに？" と聞かれたら、エニーらしく説明する。
        - "数学ってなんのためにあるの？" と聞かれたら、ホワやマースの話を交えて答える。
        """

        # 最新のAPI仕様に対応
        response = openai.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ]
        )

        reply = response.choices[0].message.content
        return jsonify({"reply": reply})
        #return jsonify({"reply": reply}, ensure_ascii=False)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
