import React, { useContext, useState } from 'react';
import bgImg from '../../Assets/img/bg-img.jpg';
import google from '../../Assets/Icons/google.png'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../AuthProvider/AuthProvider';
import useTitle from '../../hooks/useTitle';

const Login = () => {
  const { userLogin, setLoading, googleLogin } = useContext(AuthContext);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  useTitle('Login');

  const handleLogin = e => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;
    userLogin(email, password)
      .then(result => {
        const user = result.user;
        const currentUser = {
          email: user.email
        }
        console.log(currentUser);
        fetch('http://localhost:5000/jwt', {
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify(currentUser)
        })
          .then(res => res.json())
          .then(data => {
            localStorage.setItem('saad-token', data.token);
            navigate(from, { replace: true })
          })
      })
      .catch(err => {
        if (err.message === 'Firebase: Error (auth/wrong-password).') {
          setError('😠 wrong password !!');
        }
        else if (err.message === 'Firebase: Error (auth/user-not-found).') {
          setError('🙄 User Not Found. Please Sign Up.')
        }
        else {
          setError(err.message)
        }
        console.error(err);
      })
      .finally(() => setLoading(false))
  }
  const handleGoogleLogin = () => {
    googleLogin().then(result => {
      const user = result.user;
      const currentUser = {
        email: user.email
      }
      console.log(currentUser);
      fetch('http://localhost:5000/jwt', {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(currentUser)
      })
        .then(res => res.json())
        .then(data => {
          localStorage.setItem('saad-token', data.token);
          navigate(from, { replace: true })
        })
    }).catch(err => console.error(err))
  }
  return (
    <div className='pt-16 lg:pt-0'>
      <div className="hero lg:h-[100vh] flex" style={{ backgroundImage: `url(${bgImg})` }}>
        <div className="card lg:w-1/3 w-[90%] mx-auto lg:mx-0 lg:left-20">
          <form onSubmit={handleLogin} className="card-body">
            <h1 className='text-4xl font-bold text-info'>Please Login</h1>
            <div className="divider"></div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-lg font-semibold">Your Email</span>
              </label>
              <input name='email' type="email" placeholder="Your email" className="input input-bordered bg-blue-100" />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-lg font-semibold">Password <span className='text-sm text-red-600'>{error}</span></span>
              </label>
              <input name='password' type="password" placeholder="Password" className="input input-bordered bg-blue-100" />
            </div>
            <div className="my-2 flex items-center">
              <h4 className='font-semibold'>Forget password?</h4>
              <button className="font-bold text-info text-lg ml-2">Reset</button>
            </div>
            <div className="form-control">
              <button type='submit' className="btn btn-info font-bold text-white text-lg">Log in</button>
            </div>
          </form>
          <div className="divider px-8">Login with social accounts</div>
          <button onClick={handleGoogleLogin} className="btn-ghost px-3 py-2 rounded-lg mx-auto"><img className='h-8' src={google} alt="google" /></button>
          <div className="mx-auto flex items-center mt-3">
            <h4 className='font-semibold'>Don't have an account?</h4>
            <Link to="/signup" ><button className="font-bold text-info text-lg ml-2">Sign up</button></Link>
          </div>
        </div>
        <div className='w-1/2 hidden lg:block'></div>
      </div>
    </div>
  );
};

export default Login;