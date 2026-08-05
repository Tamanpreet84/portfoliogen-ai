import re
import html

ALLOWED_EXTENSIONS = {".pdf", ".docx"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

def validate_file(filename: str, size: int):
    """
    Validates file extension and size.
    Raises ValueError on invalid file.
    """
    if not filename:
        raise ValueError("Filename cannot be empty")
    
    ext = "." + filename.split(".")[-1].lower() if "." in filename else ""
    if ext not in ALLOWED_EXTENSIONS:
        raise ValueError(f"Unsupported file format '{ext}'. Allowed formats: PDF (.pdf), Word (.docx)")
    
    if size <= 0:
        raise ValueError("File is empty or corrupted")
        
    if size > MAX_FILE_SIZE:
        raise ValueError(f"File size ({size / (1024*1024):.1f}MB) exceeds the maximum allowed limit of 10MB")
        
    return ext

def sanitize_text(text: str) -> str:
    """
    Sanitizes raw text extracted from documents to prevent injection or corruption.
    """
    if not text:
        return ""
    
    # Remove null bytes and non-printable control characters (except newline, tab)
    cleaned = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\x9f]', '', text)
    
    # Escape HTML special chars to prevent XSS script injection from documents
    cleaned = html.escape(cleaned)
    
    # Standardize whitespace
    cleaned = re.sub(r'\r\n|\r', '\n', cleaned)
    cleaned = re.sub(r'[ \t]+', ' ', cleaned)
    cleaned = re.sub(r'\n{3,}', '\n\n', cleaned)
    
    return cleaned.strip()
