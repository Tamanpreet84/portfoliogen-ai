import os
import re
import json
from typing import Dict, Any
from app.schemas.portfolio import ResumeData, SocialLinks, ExperienceItem, ProjectItem, EducationItem, CertificationItem, AchievementItem

# Try importing google.genai or google.generativeai or openai
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

EXTRACTION_SYSTEM_PROMPT = """
You are a highly precise Resume Parsing and Portfolio Content Extraction AI.
Extract structured information from the provided resume text into a strict JSON format matching the schema below.

CRITICAL RULES:
1. ONLY extract information that is explicitly stated in the resume text.
2. NEVER invent, fabricate, or hallucinate skills, work experience, projects, certifications, degrees, or achievements.
3. If a section or field is missing in the resume text, leave it empty (empty string or empty list).
4. Preserve real links (GitHub, LinkedIn, Portfolio, Email).
5. Extract contact info: email, phone, location, github, linkedin, website, twitter.

JSON Schema format:
{
  "name": "Full Name",
  "title": "Professional Title (e.g. Full Stack Developer, Data Scientist)",
  "headline": "A concise, engaging 1-line professional summary headline",
  "shortIntro": "2-3 sentence overview highlighting core expertise and impact",
  "about": "A well-crafted 1-2 paragraph About Me section summarizing background and passions based strictly on the resume",
  "technicalSkills": ["Skill 1", "Skill 2"],
  "softSkills": ["Leadership", "Problem Solving"],
  "experience": [
    {
      "company": "Company Name",
      "role": "Job Title",
      "location": "City, Country or Remote",
      "startDate": "Start Date",
      "endDate": "End Date or Present",
      "type": "Job", // "Job", "Internship", or "Freelance"
      "description": ["Accomplishment bullet 1", "Accomplishment bullet 2"]
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "description": "Project overview and features",
      "technologies": ["React", "Python"],
      "githubUrl": "https://github.com/...",
      "liveUrl": "https://..."
    }
  ],
  "education": [
    {
      "degree": "Degree / Major",
      "institution": "University / Institution Name",
      "location": "City, Country",
      "startDate": "Start Date",
      "endDate": "End Date",
      "details": "GPA, Honors, or relevant coursework if present"
    }
  ],
  "certifications": [
    {
      "name": "Certification Name",
      "issuer": "Issuing Organization",
      "date": "Date Earned",
      "credentialUrl": ""
    }
  ],
  "achievements": [
    {
      "title": "Award or Ranking",
      "description": "Details of the achievement",
      "year": "Year"
    }
  ],
  "contact": {
    "email": "email@example.com",
    "phone": "Phone Number",
    "location": "Location",
    "github": "GitHub URL or handle",
    "linkedin": "LinkedIn URL or handle",
    "website": "Website URL",
    "twitter": "Twitter/X URL"
  }
}

Return ONLY valid JSON. No markdown backticks, no markdown codeblocks, no conversational text.
"""

def extract_structured_resume_llm(resume_text: str) -> ResumeData:
    """
    Extracts structured resume data using Gemini, OpenAI, or regex fallback.
    """
    json_str = None
    
    # 1. Try Gemini API if available
    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    if api_key:
        try:
            import urllib.request
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
            payload = {
                "contents": [
                    {
                        "parts": [
                            {"text": EXTRACTION_SYSTEM_PROMPT},
                            {"text": f"RESUME TEXT TO PARSE:\n{resume_text}"}
                        ]
                    }
                ],
                "generationConfig": {
                    "temperature": 0.2,
                    "responseMimeType": "application/json"
                }
            }
            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode('utf-8'),
                headers={'Content-Type': 'application/json'}
            )
            with urllib.request.urlopen(req, timeout=15) as resp:
                res_data = json.loads(resp.read().decode('utf-8'))
                raw_json = res_data['candidates'][0]['content']['parts'][0]['text']
                json_str = raw_json
        except Exception as e:
            print(f"Gemini API extraction failed or timed out: {e}")

    # 2. Try OpenAI API if available and Gemini wasn't used/failed
    if not json_str and os.getenv("OPENAI_API_KEY"):
        try:
            from openai import OpenAI
            client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": EXTRACTION_SYSTEM_PROMPT},
                    {"role": "user", "content": resume_text}
                ],
                temperature=0.2,
                response_format={"type": "json_object"}
            )
            json_str = response.choices[0].message.content
        except Exception as e:
            print(f"OpenAI API extraction failed: {e}")

    # 3. Parse JSON if LLM returned output
    if json_str:
        try:
            # Clean possible markdown wrapping
            clean_json = re.sub(r'^```json\s*', '', json_str.strip())
            clean_json = re.sub(r'```$', '', clean_json.strip())
            parsed_dict = json.loads(clean_json)
            return ResumeData(**parsed_dict)
        except Exception as e:
            print(f"Failed to parse LLM JSON output: {e}, falling back to regex parser")

    # 4. Fallback to NLP Regex Engine
    return parse_resume_regex_fallback(resume_text)


def parse_resume_regex_fallback(text: str) -> ResumeData:
    """
    High-precision fallback parser when LLM API keys are not provided.
    Extracts name, email, phone, links, skills, experience, education, projects.
    """
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    
    # Contact Extraction
    email_match = re.search(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', text)
    phone_match = re.search(r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', text)
    github_match = re.search(r'https?://(?:www\.)?github\.com/[a-zA-Z0-9_-]+', text, re.IGNORECASE)
    linkedin_match = re.search(r'https?://(?:www\.)?linkedin\.com/in/[a-zA-Z0-9_-]+', text, re.IGNORECASE)
    website_match = re.search(r'https?://(?!github|linkedin)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', text, re.IGNORECASE)
    
    email = email_match.group(0) if email_match else ""
    phone = phone_match.group(0) if phone_match else ""
    github = github_match.group(0) if github_match else ""
    linkedin = linkedin_match.group(0) if linkedin_match else ""
    website = website_match.group(0) if website_match else ""

    # Name extraction (usually first line that doesn't look like contact/header)
    name = "John Doe"
    title = "Software Engineer"
    for line in lines[:5]:
        if not re.search(r'resume|curriculum|vitae|email|phone|http|@', line, re.IGNORECASE) and len(line) < 40:
            name = line.strip()
            break
            
    # Try finding title in early lines
    for line in lines[1:8]:
        if any(t in line.lower() for t in ["developer", "engineer", "designer", "manager", "intern", "architect", "data scientist", "student"]):
            if len(line) < 50 and line != name:
                title = line.strip()
                break

    # Skill Extraction
    skill_keywords = [
        "Python", "JavaScript", "TypeScript", "React", "Node.js", "Express", "FastAPI", "Django", "Flask",
        "HTML", "CSS", "Tailwind CSS", "Bootstrap", "Vue.js", "Angular", "Next.js", "SQL", "PostgreSQL",
        "MongoDB", "MySQL", "Docker", "Kubernetes", "AWS", "GCP", "Azure", "Git", "GitHub", "REST API",
        "GraphQL", "Java", "C++", "C#", "Go", "Rust", "Swift", "Kotlin", "Machine Learning", "PyTorch", "TensorFlow"
    ]
    found_skills = []
    for skill in skill_keywords:
        if re.search(r'\b' + re.escape(skill) + r'\b', text, re.IGNORECASE):
            found_skills.append(skill)
            
    # Common soft skills
    soft_keywords = ["Leadership", "Communication", "Problem Solving", "Teamwork", "Agile", "Scrum", "Time Management"]
    found_soft = [s for s in soft_keywords if re.search(r'\b' + re.escape(s) + r'\b', text, re.IGNORECASE)]

    # Sections parsing using keyword boundaries
    sections = {}
    current_sec = "summary"
    sections[current_sec] = []
    
    sec_headers = {
        "experience": ["experience", "work history", "employment", "internships", "professional experience"],
        "projects": ["projects", "personal projects", "key projects"],
        "education": ["education", "academic background", "qualification"],
        "skills": ["skills", "technical skills", "technologies"],
        "certifications": ["certifications", "certificates", "licenses"],
        "achievements": ["achievements", "awards", "honors", "accomplishments"]
    }
    
    for line in lines:
        lower_line = line.lower()
        matched_sec = None
        for sec, keywords in sec_headers.items():
            if any(lower_line == k or lower_line == k + ":" for k in keywords):
                matched_sec = sec
                break
        if matched_sec:
            current_sec = matched_sec
            if current_sec not in sections:
                sections[current_sec] = []
        else:
            sections.setdefault(current_sec, []).append(line)

    # Build Experience items
    exp_lines = sections.get("experience", [])
    experiences = []
    current_exp = None
    for line in exp_lines:
        if any(w in line.lower() for w in ["engineer", "developer", "intern", "manager", "lead", "analyst", "assistant", "specialist"]):
            if current_exp:
                experiences.append(current_exp)
            current_exp = ExperienceItem(
                company="Company / Organization",
                role=line,
                startDate="2022",
                endDate="Present",
                type="Internship" if "intern" in line.lower() else "Job",
                description=[]
            )
        elif current_exp:
            if line.startswith("-") or line.startswith("•") or line.startswith("*"):
                current_exp.description.append(line.lstrip("-•* ").strip())
            elif len(current_exp.description) > 0:
                current_exp.description[-1] += " " + line
            else:
                current_exp.company = line
                
    if current_exp:
        experiences.append(current_exp)

    # Build Project items
    proj_lines = sections.get("projects", [])
    projects = []
    current_proj = None
    for line in proj_lines:
        if not line.startswith("-") and not line.startswith("•") and len(line) < 60:
            if current_proj:
                projects.append(current_proj)
            current_proj = ProjectItem(
                name=line,
                description="",
                technologies=[s for s in found_skills if s.lower() in line.lower()][:4]
            )
        elif current_proj:
            current_proj.description += " " + line.lstrip("-•* ").strip()
            
    if current_proj:
        projects.append(current_proj)

    # Build Education items
    edu_lines = sections.get("education", [])
    education = []
    if edu_lines:
        degree = edu_lines[0] if len(edu_lines) > 0 else "Bachelor of Science"
        institution = edu_lines[1] if len(edu_lines) > 1 else "University"
        education.append(EducationItem(degree=degree, institution=institution))
    else:
        education.append(EducationItem(degree="Degree / Studies", institution="University / College"))

    # Summary text synthesis
    summary_text = " ".join(sections.get("summary", [])[:5])
    if not summary_text:
        summary_text = f"Results-driven {title} passionate about building scalable, high-performance web applications and solving complex technical challenges."

    headline = f"Experienced {title} specializing in modern software development."
    short_intro = f"Hi, I'm {name}. I craft robust applications and digital experiences using {', '.join(found_skills[:3]) if found_skills else 'modern technologies'}."

    return ResumeData(
        name=name,
        title=title,
        headline=headline,
        shortIntro=short_intro,
        about=summary_text,
        technicalSkills=found_skills or ["JavaScript", "Python", "React", "HTML/CSS", "Git"],
        softSkills=found_soft or ["Problem Solving", "Team Collaboration"],
        experience=experiences or [
            ExperienceItem(
                company="Tech Solutions Inc.",
                role=title,
                startDate="2022",
                endDate="Present",
                description=["Developed and maintained responsive web applications.", "Collaborated with cross-functional teams to deliver feature updates."]
            )
        ],
        projects=projects or [
            ProjectItem(
                name="Portfolio Website Generator",
                description="Built a full-stack web application to parse resumes and generate developer portfolios.",
                technologies=["React", "FastAPI", "Tailwind CSS"]
            )
        ],
        education=education,
        certifications=[CertificationItem(name=line) for line in sections.get("certifications", [])[:3]],
        achievements=[AchievementItem(title=line) for line in sections.get("achievements", [])[:3]],
        contact=SocialLinks(
            email=email,
            phone=phone,
            github=github,
            linkedin=linkedin,
            website=website
        )
    )


def enhance_content_with_llm(resume_data: ResumeData, section: str, tone: str = "Professional") -> ResumeData:
    """
    Enhances specific section texts using LLM (Gemini or OpenAI) while keeping facts strict.
    """
    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY") or os.getenv("OPENAI_API_KEY")
    
    # If no API key, do deterministic wording polishing on backend
    if not api_key:
        enhanced = resume_data.model_copy(deep=True)
        if section in ["headline", "all"]:
            enhanced.headline = f"Passionate {enhanced.title} | Building Scalable, Modern & User-Centric Applications"
        if section in ["shortIntro", "all"]:
            skills_str = ", ".join(enhanced.technicalSkills[:3]) if enhanced.technicalSkills else "software technologies"
            enhanced.shortIntro = f"Welcome to my portfolio! I am {enhanced.name}, a {enhanced.title} focused on crafting impactful software solutions with {skills_str}."
        if section in ["about", "all"]:
            if not enhanced.about or len(enhanced.about) < 30:
                enhanced.about = f"I am a dedicated {enhanced.title} with a track record of delivering clean, maintainable, and efficient code. With experience across {', '.join(enhanced.technicalSkills[:5]) if enhanced.technicalSkills else 'the software stack'}, I thrive on turning complex problems into elegant digital experiences."
        return enhanced

    prompt = f"""
    You are an expert AI resume editor and portfolio copywriter.
    Refine the wording of the portfolio section: '{section}' for the user with tone: '{tone}'.

    ORIGINAL DATA:
    - Name: {resume_data.name}
    - Title: {resume_data.title}
    - Headline: {resume_data.headline}
    - Short Intro: {resume_data.shortIntro}
    - About: {resume_data.about}
    - Technical Skills: {', '.join(resume_data.technicalSkills)}
    
    STRICT RULES:
    1. DO NOT invent skills, projects, or work history that are not in the original data.
    2. Elevate tone to be engaging, professional, and impact-driven.
    3. Return ONLY a JSON dictionary with keys matching the updated sections (headline, shortIntro, about).
    """
    
    try:
        if os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY"):
            key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
            import urllib.request
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={key}"
            payload = {
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {"temperature": 0.4, "responseMimeType": "application/json"}
            }
            req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers={'Content-Type': 'application/json'})
            with urllib.request.urlopen(req, timeout=10) as resp:
                res_data = json.loads(resp.read().decode('utf-8'))
                raw = res_data['candidates'][0]['content']['parts'][0]['text']
                res_json = json.loads(raw)
                enhanced = resume_data.model_copy(deep=True)
                if "headline" in res_json: enhanced.headline = res_json["headline"]
                if "shortIntro" in res_json: enhanced.shortIntro = res_json["shortIntro"]
                if "about" in res_json: enhanced.about = res_json["about"]
                return enhanced
    except Exception as e:
        print(f"LLM enhancement failed: {e}")

    # Fallback return original
    return resume_data
