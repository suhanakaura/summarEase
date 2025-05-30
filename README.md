# SummarEase

A modern text summarization application that can process text, URLs, and files (PDF, TXT) to generate concise summaries using state-of-the-art natural language processing.

## Features

- Text summarization from direct input
- URL content summarization
- File summarization (PDF and TXT files)
- Modern, responsive UI
- Real-time processing
- Support for large text chunks

## Tech Stack

### Backend
- FastAPI
- Transformers (BART model for summarization)
- BeautifulSoup4 for web scraping
- PyPDF2 for PDF processing
- NLTK for text processing

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- Axios for API calls
- React-Dropzone for file uploads
- Heroicons for icons

## Setup

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
- Windows:
```bash
.\venv\Scripts\activate
```
- Unix/MacOS:
```bash
source venv/bin/activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Run the backend server:
```bash
uvicorn main:app --reload
```

The backend server will start at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend application will start at `http://localhost:3000`

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Choose your input method:
   - **Text**: Paste or type your text directly
   - **URL**: Enter a webpage URL to summarize its content
   - **File**: Upload a PDF or TXT file
3. Click the appropriate "Summarize" button
4. View the generated summary below

## API Endpoints

- `POST /api/summarize/text` - Summarize plain text
- `POST /api/summarize/url` - Summarize webpage content
- `POST /api/summarize/file` - Summarize file content

## License

MIT License #   s u m m a r E a s e  
 