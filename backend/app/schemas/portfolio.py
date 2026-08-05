from pydantic import BaseModel, Field
from typing import List, Optional

class EducationItem(BaseModel):
    degree: str = ""
    institution: str = ""
    location: Optional[str] = ""
    startDate: Optional[str] = ""
    endDate: Optional[str] = ""
    details: Optional[str] = ""

class ExperienceItem(BaseModel):
    company: str = ""
    role: str = ""
    location: Optional[str] = ""
    startDate: Optional[str] = ""
    endDate: Optional[str] = ""
    type: str = "Job"  # "Job", "Internship", "Freelance"
    description: List[str] = []

class ProjectItem(BaseModel):
    name: str = ""
    description: str = ""
    technologies: List[str] = []
    githubUrl: Optional[str] = ""
    liveUrl: Optional[str] = ""

class CertificationItem(BaseModel):
    name: str = ""
    issuer: Optional[str] = ""
    date: Optional[str] = ""
    credentialUrl: Optional[str] = ""

class AchievementItem(BaseModel):
    title: str = ""
    description: Optional[str] = ""
    year: Optional[str] = ""

class SocialLinks(BaseModel):
    email: Optional[str] = ""
    phone: Optional[str] = ""
    location: Optional[str] = ""
    github: Optional[str] = ""
    linkedin: Optional[str] = ""
    website: Optional[str] = ""
    twitter: Optional[str] = ""

class ResumeData(BaseModel):
    name: str = "John Doe"
    title: str = "Software Developer"
    headline: str = ""
    shortIntro: str = ""
    about: str = ""
    technicalSkills: List[str] = []
    softSkills: List[str] = []
    experience: List[ExperienceItem] = []
    projects: List[ProjectItem] = []
    education: List[EducationItem] = []
    certifications: List[CertificationItem] = []
    achievements: List[AchievementItem] = []
    contact: SocialLinks = Field(default_factory=SocialLinks)

class EnhanceRequest(BaseModel):
    resume_data: ResumeData
    section: str  # "headline", "shortIntro", "about", "projects", "experience", "all"
    tone: Optional[str] = "Professional"  # "Professional", "Technical", "Creative", "Executive"

class EnhanceResponse(BaseModel):
    success: bool
    data: ResumeData
    message: str = "Content enhanced successfully"
