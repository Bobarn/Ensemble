import { useEffect, useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal.jsx';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const [disabled, setDisabled] = useState(true)

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const onClick = () => {

      return dispatch(sessionActions.login({ credential: 'Demo-lition', password: 'password' }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  }

  useEffect(() => {
    let boolean = true
    if(credential.length >= 4 && password.length >= 6) {
      boolean = false
    }

    setDisabled(boolean);
  }, [credential, password])

  return (
    <div id='log-in-modal'>
      <h1>Log In</h1>
      <form id='log-in-form' onSubmit={handleSubmit}>
        <label>
          <input
          placeholder='Username or Email'
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          <input
          placeholder='Password'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.credential && (
          <p>{errors.credential}</p>
        )}
        <button disabled={disabled} type="submit">Log In</button>
        <h5 id='demo' onClick={onClick}>Log in as Demo User</h5>
      </form>
    </div>
  );
}

export default LoginFormModal;
