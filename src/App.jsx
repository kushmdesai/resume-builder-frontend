import React, { useState, useEffect } from "react";
import './style.css'
const generateResumeHtml = (resumeData) => {
    const htmlStyles = `
        <style>
            body { font-family: 'Inter', sans-serif; margin: 0; padding: 0; box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .resume-container { width: 100%; max-width: 21cm; margin: 0 auto; padding: 2cm; background-color: #fff; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
            h1, h2, h3 { color: #333; }
            h1 { font-size: 2.5em; text-align: center; margin-bottom: 0.5em; }
            h2 { font-size: 1.8em; border-bottom: 2px solid #ccc; padding-bottom: 5px; margin-bottom: 15px; }
            p, ul, li { font-size: 1em; line-height: 1.6; color: #555; }
            ul { list-style: none; padding: 0; margin: 0; }
            ul.experience-description li { margin-bottom: 5px; list-style: disc; margin-left: 20px; }
            .contact-info { text-align: center; color: #777; margin-bottom: 1.5em; }
            .experience-item, .education-item { margin-bottom: 1.5em; padding-bottom: 1em; border-bottom: 1px dotted #eee; }
            .experience-item:last-child, .education-item:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
            .job-title, .degree { font-weight: bold; color: #333; }
            .company, .institution { color: #666; font-style: italic; }
            .dates, .location, .field-of-study { font-size: 0.9em; color: #777; }
            .skills-list { display: flex; flex-wrap: wrap; gap: 8px; }
            .skill-tag { background-color: #e2e8f0; color: #4a5568; padding: 4px 10px; border-radius: 5px; font-size: 0.9em; }

            /* Styles for printing */
            @media print {
                body {
                    background-color: #fff;
                }
                .resume-container {
                    box-shadow: none !important;
                    border: none !important;
                    padding: 0 !important;
                    margin: 0 auto !important;
                    width: 21cm !important; /* A4 width */
                    min-height: 29.7cm !important; /* A4 height */
                    overflow: visible !important;
                }
                 html, body {
                    height: auto !important;
                    overflow: auto !important;
                }
            }
        </style>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    `;

    const experienceHtml = resumeData.experience && resumeData.experience.length > 0 ?
        resumeData.experience.map(exp => `
            <div class="experience-item">
                <h3 class="job-title">${exp.role}</h3>
                <p class="company">${exp.company} | <span class="location">${exp.location || 'Remote'}</span></p>
                <p class="dates">${exp.startDate} - ${exp.endDate || 'Present'}</p>
                <ul class="experience-description">
                    ${exp.description ? exp.description.split('\n').map(line => `<li>${line.trim()}</li>`).join('') : ''}
                </ul>
            </div>
        `).join('') : '<p>No experience added.</p>';

    const educationHtml = resumeData.education && resumeData.education.length > 0 ?
        resumeData.education.map(edu => `
            <div class="education-item">
                <h3 class="degree">${edu.degree}</h3>
                <p class="institution">${edu.institution}</p>
                <p class="field-of-study">${edu.fieldOfStudy}</p>
                <p class="dates">Graduation: ${edu.graduationYear}</p>
            </div>
        `).join('') : '<p>No education added.</p>';

    const skillsHtml = resumeData.skills && resumeData.skills.length > 0 ?
        resumeData.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('') : '<p>No skills added.</p>';

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Resume - ${resumeData.name || 'Untitled'}</title>
            ${htmlStyles}
        </head>
        <body>
            <div class="resume-container">
                <header>
                    <h1>${resumeData.name || 'Your Name'}</h1>
                    <p class="contact-info">
                        ${resumeData.email || 'your.email@example.com'} | ${resumeData.phone || '(123) 456-7890'}
                        ${resumeData.linkedin ? ` | <a href="${resumeData.linkedin}" target="_blank">${resumeData.linkedin}</a>` : ''}
                        ${resumeData.address ? ` | ${resumeData.address}` : ''}
                    </p>
                </header>

                <section>
                    <h2>Summary</h2>
                    <p>${resumeData.summary || 'A brief professional summary.'}</p>
                </section>

                <section>
                    <h2>Experience</h2>
                    ${experienceHtml}
                </section>

                <section>
                    <h2>Education</h2>
                    ${educationHtml}
                </section>

                <section>
                    <h2>Skills</h2>
                    <div class="skills-list">
                        ${skillsHtml}
                    </div>
                </section>
            </div>
        </body>
        </html>
    `;
};



function ResumeViewer({ allResumes }) {
    const [resumeIdInput, setResumeIdInput] = useState("");
    const [viewedHtml, setViewedHtml] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [foundResume, setFoundResume] = useState(null);


    const handleViewResume = () => {
        if (!resumeIdInput) {
            setError("Please enter a Resume ID.");
            setViewedHtml(null);
            setFoundResume(null);
            return;
        }

        setLoading(true);
        setError("");
        setViewedHtml(null);
        setFoundResume(null);


        const resumeToView = allResumes.find(resume => String(resume.id) === resumeIdInput);

        if (resumeToView) {

            const html = generateResumeHtml(resumeToView);
            setViewedHtml(html);
            setFoundResume(resumeToView);
            setError("");
        } else {
            setError("Resume not found with this ID.");
            setViewedHtml(null);
            setFoundResume(null);
        }
        setLoading(false);
    };


    const handleDownloadResume = () => {
        if (foundResume && viewedHtml) {

            const printWindow = window.open('', '_blank');
            if (printWindow) {
                printWindow.document.write(viewedHtml);
                printWindow.document.close();
                printWindow.focus();
                printWindow.onload = () => {
                    printWindow.print();
                };
            } else {
                setError("Please allow pop-ups for resume download/print.");
            }
        } else {
            setError("Please view a resume before attempting to download/print.");
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4 font-inter">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-[90vw] max-w-4xl">
                <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
                    View Your Resume
                </h1>
                <div className="space-y-4 mb-6">
                    <label
                        htmlFor="resumeId"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Enter Resume ID:
                    </label>
                    <input
                        type="text"
                        id="resumeId"
                        value={resumeIdInput}
                        onChange={(e) => setResumeIdInput(e.target.value)}
                        placeholder="e.g., 1700000000000"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition duration-200 shadow-sm"
                    />
                    <button
                        onClick={handleViewResume}
                        className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition duration-200 font-semibold shadow-md"
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "View Resume"}
                    </button>
                    {error && <p className="text-red-600 text-center mt-2">{error}</p>}
                </div>

                {viewedHtml && (
                    <div className="border-t pt-4 mt-4 border-gray-200 bg-gray-50">
                        <iframe
                            srcDoc={viewedHtml}
                            title="Resume Preview"
                            className="w-full h-[1000px] border-0 rounded-lg shadow-inner"
                        />
                    </div>
                )}
                <button
                    onClick={handleDownloadResume}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-200 font-semibold shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed mt-4"
                    disabled={!foundResume || loading}
                >
                    Download/Print Resume
                </button>
            </div>
        </div>
    );
}


function App() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        linkedin: "", 
        address: "",  
        summary: "",
    });

 
    const [experiences, setExperiences] = useState([]);

    const [newExperience, setNewExperience] = useState({
        company: "",
        role: "",
        startDate: "",
        endDate: "",
        description: "",
        location: "", 
    });

   
    const [education, setEducation] = useState([]);

    const [newEducation, setNewEducation] = useState({
        institution: "",
        degree: "",
        fieldOfStudy: "",
        graduationYear: "",
    });

  
    const [skills, setSkills] = useState([]);
    const [newSkill, setNewSkill] = useState("");


    const [message, setMessage] = useState("");

    const [currentResumeId, setCurrentResumeId] = useState(null);

    const [allResumes, setAllResumes] = useState(() => {
        try {
            const storedResumes = localStorage.getItem('allResumes');
            return storedResumes ? JSON.parse(storedResumes) : [];
        } catch (e) {
            console.error("Failed to load resumes from localStorage:", e);
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('allResumes', JSON.stringify(allResumes));
        } catch (e) {
            console.error("Failed to save resumes to localStorage:", e);
        }
    }, [allResumes]);

    const [currentPage, setCurrentPage] = useState("builder");

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleExperienceChange = (e) => {
        setNewExperience({ ...newExperience, [e.target.name]: e.target.value });
    };

    const addExperience = () => {
        if (newExperience.company && newExperience.role && newExperience.startDate) {
            setExperiences([...experiences, newExperience]);
            setNewExperience({
                company: "",
                role: "",
                startDate: "",
                endDate: "",
                description: "",
                location: "",
            });
            setMessage("");
        } else {
            setMessage("Please fill in Company, Role, and Start Date for experience.");
        }
    };

    const removeExperience = (indexToRemove) => {
        setExperiences(experiences.filter((_, index) => index !== indexToRemove));
    };

    const handleEducationChange = (e) => {
        setNewEducation({ ...newEducation, [e.target.name]: e.target.value });
    };

    const addEducation = () => {
        if (newEducation.institution && newEducation.degree && newEducation.graduationYear) {
            setEducation([...education, newEducation]);
            setNewEducation({
                institution: "",
                degree: "",
                fieldOfStudy: "",
                graduationYear: "",
            });
            setMessage("");
        } else {
            setMessage("Please fill in Institution, Degree, and Graduation Year for education.");
        }
    };

    const removeEducation = (indexToRemove) => {
        setEducation(education.filter((_, index) => index !== indexToRemove));
    };

    const addSkill = () => {
        if (newSkill.trim() !== "") {
            setSkills([...skills, newSkill.trim()]);
            setNewSkill("");
            setMessage("");
        }
    };

    const removeSkill = (indexToRemove) => {
        setSkills(skills.filter((_, index) => index !== indexToRemove));
    };

    const clearFormFields = () => {
        setFormData({
            name: "",
            email: "",
            phone: "",
            linkedin: "",
            address: "",
            summary: "",
        });
        setExperiences([]);
        setEducation([]);
        setSkills([]);
        setNewExperience({
            company: "", role: "", startDate: "", endDate: "", description: "", location: ""
        });
        setNewEducation({
            institution: "", degree: "", fieldOfStudy: "", graduationYear: ""
        });
        setNewSkill("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("Saving resume...");
        setCurrentResumeId(null);

        const newResumeId = Date.now();

        const newResumeData = {
            id: newResumeId,
            ...formData,
            experience: experiences,
            education: education,
            skills: skills,
        };

        setAllResumes(prevResumes => {
            const updatedResumes = [...prevResumes, newResumeData];
            return updatedResumes;
        });

        setMessage("Resume submitted successfully!");
        setCurrentResumeId(newResumeId);

        clearFormFields();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4 font-inter">
            <div className="mb-6 flex space-x-4">
                <button
                    onClick={() => setCurrentPage("builder")}
                    className={`px-6 py-3 rounded-lg font-semibold shadow-md transition duration-200 ${
                        currentPage === "builder"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                    Build Resume
                </button>
                <button
                    onClick={() => setCurrentPage("viewer")}
                    className={`px-6 py-3 rounded-lg font-semibold shadow-md transition duration-200 ${
                        currentPage === "viewer"
                            ? "bg-purple-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                    View Resumes
                </button>
            </div>

            {currentPage === "builder" && (
                <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl">
                    <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
                        Resume Builder
                    </h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="bg-gray-50 p-6 rounded-xl shadow-inner">
                            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                                Personal Information
                            </h2>
                            {[
                                { id: "name", label: "Full Name", type: "text" },
                                { id: "email", label: "Email", type: "email" },
                                { id: "phone", label: "Phone", type: "tel" },
                                { id: "linkedin", label: "LinkedIn Profile URL", type: "text" },
                                { id: "address", label: "Address (City, State)", type: "text" },
                                { id: "summary", label: "Professional Summary", type: "textarea" },
                            ].map((field) => (
                                <div key={field.id} className="mb-4">
                                    <label
                                        htmlFor={field.id}
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        {field.label}
                                    </label>
                                    {field.type === "textarea" ? (
                                        <textarea
                                            id={field.id}
                                            name={field.id}
                                            value={formData[field.id]}
                                            onChange={handleFormChange}
                                            required={field.id !== "linkedin" && field.id !== "address"}
                                            rows="4"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200 shadow-sm"
                                            placeholder={`Enter your ${field.label.toLowerCase()}`}
                                        ></textarea>
                                    ) : (
                                        <input
                                            type={field.type}
                                            id={field.id}
                                            name={field.id}
                                            value={formData[field.id]}
                                            onChange={handleFormChange}
                                            required={field.id !== "linkedin" && field.id !== "address"} 
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200 shadow-sm"
                                            placeholder={`Enter your ${field.label.toLowerCase()}`}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="bg-gray-50 p-6 rounded-xl shadow-inner">
                            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                                Experience
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                                    <input type="text" id="company" name="company" value={newExperience.company} onChange={handleExperienceChange} placeholder="e.g., Google"  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"/>
                                </div>
                                <div>
                                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                    <input type="text" id="role" name="role" value={newExperience.role} onChange={handleExperienceChange} placeholder="e.g., Software Engineer"  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"/>
                                </div>
                                <div>
                                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                    <input type="month" id="startDate" name="startDate" value={newExperience.startDate} onChange={handleExperienceChange}  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"/>
                                </div>
                                <div>
                                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">End Date (or Present)</label>
                                    <input type="month" id="endDate" name="endDate" value={newExperience.endDate} onChange={handleExperienceChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"/>
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                    <input type="text" id="location" name="location" value={newExperience.location} onChange={handleExperienceChange} placeholder="e.g., New York, NY" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"/>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="description"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={newExperience.description}
                                    onChange={handleExperienceChange}
                                    rows="3"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200 shadow-sm"
                                    placeholder="Briefly describe your responsibilities and achievements (use bullet points for readability)."
                                ></textarea>
                            </div>
                            <button
                                type="button"
                                onClick={addExperience}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold shadow-md"
                            >
                                Add Experience
                            </button>
                            <ul className="mt-4 space-y-2">
                                {experiences.map((exp, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm border border-gray-200"
                                    >
                                        <div>
                                            <strong className="text-gray-800">{exp.company}</strong> -{" "}
                                            <span className="text-gray-600">{exp.role}</span>
                                            <div className="text-xs text-gray-500">
                                                {exp.startDate} to {exp.endDate || "Present"} ({exp.location})
                                            </div>
                                            {exp.description && (
                                                <p className="text-sm text-gray-700 mt-1">
                                                    {exp.description}
                                                </p>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeExperience(index)}
                                            className="ml-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-200 flex items-center justify-center"
                                            aria-label="Remove experience"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-xl shadow-inner">
                            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                                Education
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label
                                        htmlFor="institution"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Institution
                                    </label>
                                    <input
                                        type="text"
                                        id="institution"
                                        name="institution"
                                        value={newEducation.institution}
                                        onChange={handleEducationChange}
                                        placeholder="e.g., University of Toronto"
                                        
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="degree"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Degree
                                    </label>
                                    <input
                                        type="text"
                                        id="degree"
                                        name="degree"
                                        value={newEducation.degree}
                                        onChange={handleEducationChange}
                                        placeholder="e.g., Bachelor of Science"
                                        
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="fieldOfStudy"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Field of Study
                                    </label>
                                    <input
                                        type="text"
                                        id="fieldOfStudy"
                                        name="fieldOfStudy"
                                        value={newEducation.fieldOfStudy}
                                        onChange={handleEducationChange}
                                        placeholder="e.g., Computer Science"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="graduationYear"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Graduation Year
                                    </label>
                                    <input
                                        type="number"
                                        id="graduationYear"
                                        name="graduationYear"
                                        value={newEducation.graduationYear}
                                        onChange={handleEducationChange}
                                        placeholder="e.g., 2024"
                                        
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                                    />
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={addEducation}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold shadow-md"
                            >
                                Add Education
                            </button>
                            <ul className="mt-4 space-y-2">
                                {education.map((edu, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm border border-gray-200"
                                    >
                                        <div>
                                            <strong className="text-gray-800">
                                                {edu.institution}
                                            </strong>{" "}
                                            - <span className="text-gray-600">{edu.degree}</span>
                                            {edu.fieldOfStudy && (
                                                <span className="text-gray-500">
                                                    {" "}
                                                    ({edu.fieldOfStudy})
                                                </span>
                                            )}
                                            {edu.graduationYear && (
                                                <div className="text-xs text-gray-500">
                                                    Graduation: {edu.graduationYear}
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeEducation(index)}
                                            className="ml-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-200 flex items-center justify-center"
                                            aria-label="Remove education"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-xl shadow-inner">
                            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                                Skills
                            </h2>
                            <div className="flex items-center gap-2 mb-4">
                                <input
                                    type="text"
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    placeholder="e.g., Python"
                                    className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                                />
                                <button
                                    type="button"
                                    onClick={addSkill}
                                    className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold shadow-md"
                                >
                                    Add Skill
                                </button>
                            </div>
                            <ul className="mt-4 flex flex-wrap gap-2">
                                {skills.map((skill, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center bg-white px-3 py-1 rounded-full shadow-sm border border-gray-200 text-gray-700 text-sm"
                                    >
                                        {skill}
                                        <button
                                            type="button"
                                            onClick={() => removeSkill(index)}
                                            className="ml-2 text-red-500 hover:text-red-700"
                                            aria-label="Remove skill"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition duration-200 font-bold text-lg shadow-lg"
                        >
                            Submit Resume
                        </button>
                    </form>
                    {message && (
                        <p className="mt-6 text-center text-lg font-medium">
                            {message} {currentResumeId && `Your Resume ID is: `}
                            {currentResumeId && (
                                <span className="text-blue-600 font-bold">{currentResumeId}</span>
                            )}
                            {currentResumeId && `. You can use this ID to view your resume.`}
                        </p>
                    )}
                </div>
            )}

            {currentPage === "viewer" && <ResumeViewer allResumes={allResumes} />}
        </div>
    );
}

export default App;