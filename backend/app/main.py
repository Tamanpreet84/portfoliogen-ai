from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response
import io
import zipfile

from app.utils.sanitizer import validate_file
from app.services.parser import parse_resume_document
from app.services.llm_service import extract_structured_resume_llm, enhance_content_with_llm
from app.schemas.portfolio import ResumeData, EnhanceRequest, EnhanceResponse

app = FastAPI(
    title="PortfolioGen AI Backend",
    description="Resume to Portfolio Website Generator powered by Generative AI",
    version="1.0.0"
)

# Enable CORS for frontend and deployment domain flexibility
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "app": "PortfolioGen AI API",
        "status": "online",
        "docs": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "portfoliogen-backend"}

@app.post("/api/upload")
async def upload_resume(file: UploadFile = File(...)):
    """
    Accepts PDF or DOCX resume, validates file type & size, extracts text,
    and runs Generative AI parser to structure resume information.
    """
    try:
        # Read file bytes
        contents = await file.read()
        file_size = len(contents)
        
        # 1. Validate file format and size
        ext = validate_file(file.filename, file_size)
        
        # 2. Extract plain text
        extracted_text = parse_resume_document(contents, file.filename)
        
        # 3. Process text into structured ResumeData schema using AI/Regex
        structured_data = extract_structured_resume_llm(extracted_text)
        
        return JSONResponse(status_code=200, content={
            "success": True,
            "filename": file.filename,
            "fileSize": file_size,
            "fileType": ext,
            "data": structured_data.model_dump()
        })

    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        print(f"Internal processing error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to process resume: {str(e)}")

@app.post("/api/enhance", response_model=EnhanceResponse)
async def enhance_section(request: EnhanceRequest):
    """
    Uses Generative AI to refine headlines, short intro, about me, and descriptions
    without inventing unstated facts.
    """
    try:
        enhanced_data = enhance_content_with_llm(request.resume_data, request.section, request.tone)
        return EnhanceResponse(
            success=True,
            data=enhanced_data,
            message=f"Section '{request.section}' successfully enhanced using AI."
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI enhancement error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
