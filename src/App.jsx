import React, { useState } from "react";
import "./style.css";

// Component to view a resume by ID
function ResumeViewer() {
  const [resumeIdInput, setResumeIdInput] = useState("");
  const [viewedHtml, setViewedHtml] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleViewResume = async () => {
    if (!resumeIdInput) {
      setError("Please enter a Resume ID.");
      setViewedHtml(null);
      return;
    }

    setLoading(true);
    setError("");
    setViewedHtml(null);

    try {
      const res = await fetch(
        `http://localhost:5000/resumes/${resumeIdInput}/template`
      );
      if (res.ok) {
        const html = await res.text();
        setViewedHtml(html);
      } else {
        let errorMessage = "Resume not found.";
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          errorMessage = await res.text();
        }
        setError("Error fetching resume: " + errorMessage);
      }
    } catch (err) {
      setError("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4 font-inter">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-[90vw]">
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
            type="number" // Use number type for ID
            id="resumeId"
            value={resumeIdInput}
            onChange={(e) => setResumeIdInput(e.target.value)}
            placeholder="e.g., 1"
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
              className="w-full h-[600px] border-0"
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Main App component for the Resume Builder
function App() {
  // State to manage the basic contact and summary information
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    summary: "",
  });

  // State to manage the list of experiences
  const [experiences, setExperiences] = useState([]);
  // State for the current experience being added
  const [newExperience, setNewExperience] = useState({
    company: "",
    role: "",
    startDate: "",
    endDate: "",
    description: "", // Added description field
  });

  // State to manage the list of education entries
  const [education, setEducation] = useState([]);
  // State for the current education entry being added
  const [newEducation, setNewEducation] = useState({
    institution: "",
    degree: "",
    fieldOfStudy: "", // Added field of study
    graduationYear: "",
  });

  // State to manage the list of skills
  const [skills, setSkills] = useState([]);
  // State for the current skill being added
  const [newSkill, setNewSkill] = useState("");

  // State for messages displayed to the user (e.g., success/error)
  const [message, setMessage] = useState("");
  // State to store the ID of the created resume
  const [resumeId, setResumeId] = useState(null);

  // State to control which page is shown: 'builder' or 'viewer'
  const [currentPage, setCurrentPage] = useState("builder");

  // Handles changes for basic form fields (name, email, phone, summary)
  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handles changes for new experience fields
  const handleExperienceChange = (e) => {
    setNewExperience({ ...newExperience, [e.target.name]: e.target.value });
  };

  // Adds a new experience to the experiences list
  const addExperience = () => {
    if (newExperience.company && newExperience.role) {
      setExperiences([...experiences, newExperience]);
      setNewExperience({
        company: "",
        role: "",
        startDate: "",
        endDate: "",
        description: "",
      });
    }
  };

  // Removes an experience from the experiences list by index
  const removeExperience = (indexToRemove) => {
    setExperiences(experiences.filter((_, index) => index !== indexToRemove));
  };

  // Handles changes for new education fields
  const handleEducationChange = (e) => {
    setNewEducation({ ...newEducation, [e.target.name]: e.target.value });
  };

  // Adds a new education entry to the education list
  const addEducation = () => {
    if (newEducation.institution && newEducation.degree) {
      setEducation([...education, newEducation]);
      setNewEducation({
        institution: "",
        degree: "",
        fieldOfStudy: "",
        graduationYear: "",
      });
    }
  };

  // Removes an education entry from the education list by index
  const removeEducation = (indexToRemove) => {
    setEducation(education.filter((_, index) => index !== indexToRemove));
  };

  // Adds a new skill to the skills list
  const addSkill = () => {
    if (newSkill.trim() !== "") {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  // Removes a skill from the skills list by index
  const removeSkill = (indexToRemove) => {
    setSkills(skills.filter((_, index) => index !== indexToRemove));
  };

  // Handles the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Submitting resume..."); // Provide immediate feedback
    setResumeId(null); // Clear previous ID

    // Construct the payload to send to the backend
    const payload = {
      ...formData,
      experience: experiences,
      education: education, // Include education in the payload
      skills: skills,
    };

    try {
      const res = await fetch("http://localhost:5000/resumes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        setMessage("Resume submitted successfully!");
        setResumeId(data.id); // Capture the returned ID
        // Clear the form after successful submission
        setFormData({ name: "", email: "", phone: "", summary: "" });
        setExperiences([]);
        setEducation([]);
        setSkills([]);
      } else {
        const errorData = await res.json();
        setMessage("Error submitting resume: " + errorData.message);
        setResumeId(null);
      }
    } catch (error) {
      setMessage("Network error: " + error.message);
      setResumeId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4 font-inter">
      {/* Navigation Buttons */}
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

      {/* Conditional Rendering of Pages */}
      {currentPage === "builder" && (
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl">
          <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
            Resume Builder
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information Section */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-inner">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                Personal Information
              </h2>
              {["name", "email", "phone", "summary"].map((field) => (
                <div key={field} className="mb-4">
                  <label
                    htmlFor={field}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  {field === "summary" ? (
                    <textarea
                      id={field}
                      name={field}
                      value={formData[field]}
                      onChange={handleFormChange}
                      required
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200 shadow-sm"
                      placeholder={`Enter your ${field}`}
                    ></textarea>
                  ) : (
                    <input
                      type={
                        field === "email"
                          ? "email"
                          : field === "phone"
                          ? "tel"
                          : "text"
                      }
                      id={field}
                      name={field}
                      value={formData[field]}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200 shadow-sm"
                      placeholder={`Enter your ${field}`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Experience Section */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-inner">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                Experience
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    htmlFor="company"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={newExperience.company}
                    onChange={handleExperienceChange}
                    placeholder="e.g., Google"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Role
                  </label>
                  <input
                    type="text"
                    id="role"
                    name="role"
                    value={newExperience.role}
                    onChange={handleExperienceChange}
                    placeholder="e.g., Software Engineer"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="startDate"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={newExperience.startDate}
                    onChange={handleExperienceChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="endDate"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    End Date (or Present)
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={newExperience.endDate}
                    onChange={handleExperienceChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  />
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
                  placeholder="Briefly describe your responsibilities and achievements."
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
                        {exp.startDate} to {exp.endDate || "Present"}
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

            {/* Education Section */}
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

            {/* Skills Section */}
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
              {message} {resumeId && `Your Resume ID is: `}
              {resumeId && (
                <span className="text-blue-600 font-bold">{resumeId}</span>
              )}
              {resumeId && `. You can use this ID to view your resume.`}
            </p>
          )}
        </div>
      )}

      {currentPage === "viewer" && <ResumeViewer />}
    </div>
  );
}

export default App;