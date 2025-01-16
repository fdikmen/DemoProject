<h1 align="center">
  <img alt="logo" src="./assets/icon.png" width="124px" style="border-radius:10px"/><br/>
AI Powered Text Summarizer App</h1>

## 📱 About The Project

This mobile application is a powerful tool featuring OCR (Optical Character Recognition) and AI-powered text summarization capabilities. Using the OpenAI API, it transforms lengthy texts into meaningful and concise summaries.

### 🚀 Features

- 📸 Text extraction from images (OCR)
- 🤖 AI-powered text summarization
- 📝 Summaries up to 100 words
- 📱 iOS and Android support
- 🎨 Modern and user-friendly interface

## 🛠️ Requirements

- [React Native development environment](https://reactnative.dev/docs/environment-setup)
- [Node.js LTS version](https://nodejs.org/en/)
- [Git](https://git-scm.com/)
- [Watchman](https://facebook.github.io/watchman/docs/install#buildinstall) (required only for macOS or Linux users)
- [Pnpm](https://pnpm.io/installation)
- [VS Code Editor](https://code.visualstudio.com/download) or [Cursor](https://www.cursor.com/)

## 🚀 Quick Start

Clone the project and install dependencies:

```sh
git clone https://github.com/your-username/your-repo-name

cd ./your-repo-name

pnpm install
```

To run on iOS:

```sh
pnpm ios
```

To run on Android:

```sh
pnpm android
```

## ⚙️ Environment Variables

Create a `.env` file and set the required variables before running the app:

```env
OPENAI_API_KEY=your-api-key-here
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-3.5-turbo
OPENAI_MAX_TOKENS=150
```

## 📖 Usage

1. Launch the application
2. Select or capture an image containing text
3. OCR will automatically extract the text
4. AI will analyze and summarize the text
5. View and share the summary

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 📞 Contact

Project Owner - [@your-twitter](https://twitter.com/your-twitter)

Project Link: [https://github.com/your-username/your-repo-name](https://github.com/your-username/your-repo-name)
