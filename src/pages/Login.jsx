import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEnvelope, 
  faLock, 
  faEye, 
  faEyeSlash,
  faExclamationCircle
} from '@fortawesome/free-solid-svg-icons';
import { login, isAuthenticated } from '../utils/auth';
import '../styles/Login.css';
import logo from '../assets/logo.svg';

const Login = () => {
  // Estado para los campos del formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // Estado para la validación y errores
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [formError, setFormError] = useState('');
  
  // Estado para el proceso de inicio de sesión
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  
  // Verificar si el usuario ya está autenticado
  useEffect(() => {
    if (isAuthenticated()) {
      // Redireccionar al dashboard si ya está logueado
      navigate('/dashboard');
    }
    
    // Verificar si hay un email guardado anteriormente
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, [navigate]);
  
  // Validar email
  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!email) {
      setEmailError('El email es obligatorio');
      return false;
    } else if (!re.test(email.toLowerCase())) {
      setEmailError('El formato del email no es válido');
      return false;
    } else {
      setEmailError('');
      return true;
    }
  };
  
  // Validar contraseña
  const validatePassword = (password) => {
    if (!password) {
      setPasswordError('La contraseña es obligatoria');
      return false;
    } else {
      setPasswordError('');
      return true;
    }
  };
  
  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Limpiar errores previos
    setFormError('');
    
    // Validar campos
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    
    if (!isEmailValid || !isPasswordValid) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Llamar a la función de login
      const result = await login(email, password);
      
      if (result.success) {
        // Guardar email si "recordarme" está activado
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }
        
        // Redirigir al dashboard
        navigate('/dashboard');
      } else {
        // Mostrar error devuelto por la API
        setFormError(result.message || 'Error al iniciar sesión. Verifica tus credenciales.');
      }
    } catch (error) {
      console.error('Error durante el inicio de sesión:', error);
      setFormError('Error al conectar con el servidor. Inténtalo más tarde.');
    } finally {
      setLoading(false);
    }
  };
  
  // Alternar visibilidad de la contraseña
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <div className="login-page">
      <div className="login-background">
        <div className="overlay"></div>
      </div>
      
      <div className="login-content">
        <div className="login-card">
          <div className="login-logo">
            <img src={logo} alt="Outdoer" />
          </div>
          
          <h1>Iniciar Sesión</h1>
          <p className="login-subtitle">Accede a tu cuenta y explora nuevas aventuras</p>
          
          {formError && (
            <div className="form-error">
              <FontAwesomeIcon icon={faExclamationCircle} />
              <span>{formError}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className={`form-group ${emailError ? 'has-error' : ''}`}>
              <label htmlFor="email">Correo Electrónico</label>
              <div className="input-wrapper">
                <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    validateEmail(e.target.value);
                  }}
                  placeholder="Ingresa tu correo electrónico"
                  disabled={loading}
                />
              </div>
              {emailError && <div className="error-message">{emailError}</div>}
            </div>
            
            <div className={`form-group ${passwordError ? 'has-error' : ''}`}>
              <div className="label-row">
                <label htmlFor="password">Contraseña</label>
                <Link to="/forgot-password" className="forgot-link">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="input-wrapper">
                <FontAwesomeIcon icon={faLock} className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    validatePassword(e.target.value);
                  }}
                  placeholder="Ingresa tu contraseña"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
              {passwordError && <div className="error-message">{passwordError}</div>}
            </div>
            
            <div className="remember-me">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                />
                <span className="checkmark"></span>
                Recordarme
              </label>
            </div>
            
            <button
              type="submit"
              className={`login-button ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <div className="button-spinner"></div>
              ) : 'Iniciar Sesión'}
            </button>
          </form>
          
          <div className="separator">
            <span>O</span>
          </div>
          
          <div className="social-login">
            <button className="social-button google">
              <img src="/img/google.svg" alt="Google" />
              Continuar con Google
            </button>
            <button className="social-button facebook">
              <img src="/img/facebook.svg" alt="Facebook" />
              Continuar con Facebook
            </button>
          </div>
          
          <div className="register-prompt">
            ¿No tienes una cuenta?{' '}
            <Link to="/register" className="register-link">
              Regístrate
            </Link>
          </div>
        </div>
        
        <div className="login-footer">
          <p>&copy; {new Date().getFullYear()} Outdoer. Todos los derechos reservados.</p>
          <div className="footer-links">
            <Link to="/privacy">Privacidad</Link>
            <Link to="/terms">Términos</Link>
            <Link to="/help">Ayuda</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;