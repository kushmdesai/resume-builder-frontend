import { useState } from 'react';

function App() {
    const [formdata, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        summary: '',
        experience: '',
        education: ''
    });

    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({...formdata, [e.target.name]: e.target.value});
    };
    const [skills, setSkills] = useState([]);
    const [newskill, setNewSkill] = useState('');

    const handleSubmit = async(e) => {
        e.preventDefault();

        const payload = {
            ...formdata,
            experience: JSON.parse(formdata.experience || "[]"),
            education: JSON.parse(formdata.education || "[]"),
            skills,
        };

        try {
            const res = await fetch('http://localhost:5000/resumes', {
                method: 'POST',
                headers: {
                    'Content-Type':'application/json',
                    
                },
                body: JSON.stringify(payload)
            });

            if(res.ok) {
                setMessage('Resume submitted successfully!');
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    summary: '',
                    experience: '',
                    education: '',
                    skills: ''
                });
            } else {
                const errorData = await res.json();
                setMessage('Error submitting resume:' + errorData.message);
            }
        } catch (error) {
            setMessage(' Network error:' + error.message);
        }
    };

    return (
        <div style={{ maxWidth: "600px", margin: "auto", padding: "2rem"}}>
            <h1>Resume Builder</h1>
            <form onSubmit={handleSubmit}>
                {["name", "email", "phone", "summary"].map((field) => (
                    <div key={field}>
                        <label>
                            {field[0].toLocaleUpperCase() + field.slice(1)} <br />
                            <input
                                name={field}
                                value={formdata[field]}
                                onChange={handleChange}
                                required 
                                style={{width: "100%", padding: "8px"}}
                            />
                        </label> <br /><br />
                    </div>
                ))}
                <label>
                    Experience (JSON array) <br />
                    <textarea 
                        name="experience" 
                        value={formdata.experience}
                        onChange={handleChange}
                        placeholder='[{"company": "Hackclub", "role": "Hacker"}]'
                        style={{width: "100%", height: "80px", padding: "8px"}}
                        />
                </label> <br /><br />

                <label>
                    Skills<br />
                    <input 
                        type="text"
                        value={newskill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder='e.g. Python'
                        style={{width: '70%', padding: '8px'}}
                    />
                    <button
                        type='button'
                        onClick={() => {
                            if(newskill.trim() !== '') {
                                setSkills([...skills, newskill.trim()]);
                                setNewSkill('');
                            }
                        }}
                        style={{padding: '8px', marginLeft: '10px'}}
                        >
                            Add Skill
                        </button>
                </label>
                <ul style={{marginTop:' 10px', paddingLeft: '20px'}}>
                    {skills.map((skill,index) =>(
                        <li key={index} style={{marginTop: '5px'}}>
                            {skill} 
                            <button
                                type='button'
                                onClick={() => setSkills(skills.filter((_, i) => i !== index))}
                                style={{
                                    marginLeft: '10px',
                                    padding: '5px 6px',
                                    background: '#f44336',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>

                <button type='submit' style={{padding: "10px 20px"}}>
                    Submit Resume
                </button>
            </form>
            {message && <p style={{ marginTop: "1rem"}}>{message}</p>}
        </div>
    )
}

export default App;