import { useNavigate } from "react-router-dom"
import './SingUp.css';
import { useState } from 'react';

export default function SingUp({ setUsername }) {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [touched, setTouched] = useState(false);

  function handleInputChange(e) {
    const value = e.target.value;
    setInputValue(value);
    
    if (touched) {
      if (!value.trim()) {
        setError('Please enter your name to continue');
      } else {
        setError('');
      }
    }
  }

  function handleBlur() {
    setTouched(true);
    if (!inputValue.trim()) {
      setError('Please enter your name to continue');
    }
  }

  function usernameSubmit(e) {
    e.preventDefault();
    if (inputValue.trim()) {
      setUsername(inputValue);
      navigate("/chat");
    } else {
      setError('Please enter your name to continue');
      setTouched(true);
      
      // Add shake animation to the input field
      const inputField = document.querySelector('.input-field');
      inputField.classList.add('shake-error');
      setTimeout(() => {
        inputField.classList.remove('shake-error');
      }, 500);
    }
  }

  return (
    <div id="signupPage" className="signup-container">
      <div className="bg-circle bg-circle-1"></div>
      <div className="bg-circle bg-circle-2"></div>
      <div className="signup-card">
        <h1 id="OmegelCloneHeading" className="app-title">Omegle Clone</h1>
        <p className="app-description">Connect with random people around the world</p>
        <form onSubmit={usernameSubmit} className="signup-form">
          <div className="input-container">
            <input 
              type="text" 
              className={`singupInputBox input-field ${error && touched ? 'input-error' : ''}`}
              placeholder='Enter Your Name' 
              autoFocus
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleBlur}
            />
            {error && touched && <div className="error-message">{error}</div>}
          </div>
          <input 
            type="submit" 
            className="singupInputBox submit-button" 
            id="signupSubmitBtn" 
            value="Start Chat" 
          />
        </form>
      </div>
    </div>
  )
}
