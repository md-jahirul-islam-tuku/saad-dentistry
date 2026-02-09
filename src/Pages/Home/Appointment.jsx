import React from 'react';
import bgImg from '../../Assets/img/bg-img.jpg'

const Appointment = () => {
  return (
    <div id='appointment' className='my-10'>
      <div className="hero h-[80vh] lg:flex" style={{ backgroundImage: `url(${bgImg})` }}>
        <div className="card w-full lg:w-1/3 lg:left-20">
          <div className="card-body">
            <h3 className='text-2xl font-semibold text-accent text-left'>Book Your Visit At</h3>
            <h1 className='text-4xl font-bold text-info text-left'>SaaDDentistry</h1>
            <hr></hr>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-lg font-semibold">Your Name</span>
              </label>
              <input type="text" placeholder="Your Name" className="input input-bordered bg-blue-100" />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-lg font-semibold">Your Email</span>
              </label>
              <input type="email" placeholder="Your email" className="input input-bordered bg-blue-100" />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-lg font-semibold">Appointment date</span>
              </label>
              <input type="date" placeholder="Appointment date" className="input input-bordered bg-blue-100" />
            </div>
            <div className="form-control mt-6">
              <button className="btn btn-info font-semibold text-white hover:bg-gradient-to-r from-info to-accent border-0">Book Appointment Now</button>
            </div>
          </div>
        </div>
        <div className='hidden lg:block w-1/2'></div>
      </div>
    </div>
  );
};

export default Appointment;