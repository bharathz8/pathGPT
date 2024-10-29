import React, { useContext } from 'react';
import './Main.css';
import { assets } from "../../assets/assets";
import { Context } from '../../Context/Context';

const Main = () => {
  const { onSent, recentPrompt, showResult, loading, decision, courses, projects, formData, setFormData, newChat } = useContext(Context);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Trigger response processing
    onSent();
  };

  return (
    <div className='main'>
      <div className='nav'>
        <p>pathGPT</p>
        <img onClick={newChat} src={assets.user_icon} alt='user-icon' />
      </div>

      <div className='main-container'>
        {!showResult ? (
          <>
            <div className='greet'>
              <p><span>Enter the input</span></p>
              <p>To get your desired </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div>
                <label>Desired Skills:</label>
                <input
                  type="text"
                  name="desiredSkills"
                  value={formData.desiredSkills}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Education:</label>
                <input
                  type="text"
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Technologies Known:</label>
                <input
                  type="text"
                  name="technologies"
                  value={formData.technologies}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Level of Coding:</label>
                <select name="codingLevel" value={formData.codingLevel} onChange={handleChange}>
                  <option value="">Select Level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label>Any Other Project:</label>
                <textarea
                  name="otherProjects"
                  value={formData.otherProjects}
                  onChange={handleChange}
                ></textarea>
              </div>

              <button type="submit">Submit</button>
            </form>
          </>
        ) : (
          <div className='result'>
            <div className='result-title'>
              <button className='back-button' onClick={newChat}>Back</button>
              <p>{recentPrompt}</p>
            </div>
            <div className='result-data'>
              <img src={assets.gemini_icon} alt='gemini-icon' />
              {loading ? (
                <div className='loader'>
                  <hr />
                  <hr />
                  <hr />
                </div>
              ) : (
                <div>
                <div>
                    <p className="card-title">Career Suggestion</p>
                    <div className="card-content" dangerouslySetInnerHTML={{ __html: decision }}></div>
                  </div>
                <div className="cards-container">
                  <div className="card">
                    <p className="card-title">Courses</p>
                    <div className="card-content" dangerouslySetInnerHTML={{ __html: courses }}></div>
                  </div>
                  <div className="card">
                    <p className="card-title">Projects</p>
                    <div className="card-content" dangerouslySetInnerHTML={{ __html: projects }}></div>
                  </div>
                </div>
                </div>

              )}
            </div>
          </div>
        )}
      </div>

      <div className='main-bottom'>
        <p className='bottom-info'>
          pathGPT is powered by Gemini, it may display inaccurate information so check its responses.
        </p>
      </div>
    </div>
  );
};

export default Main;
