import React, { useContext } from 'react';
import { FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../AuthProvider/AuthProvider';

const Review = ({ review, handleDelete }) => {
  const { _id, date, name, image, rating, text, email, serviceName } = review;
  const { user } = useContext(AuthContext);

  return (
    <div className="mt-5 container bg-info/10 shadow-lg flex flex-col p-6 mx-auto divide-y rounded-lg divide-gray-700">
      <div className="flex justify-between p-4">
        <div className="flex space-x-4">
          <div>
            <img src={image} alt="User" className="object-cover w-12 h-12 rounded-full dark:bg-gray-500 border border-info" />
          </div>
          <div>
            <h4 className="font-bold">{name}</h4>
            <span className="text-xs">{date}</span>
          </div>
        </div>
        <div className="flex items-center dark:text-yellow-500">
          <FaStar className='text-yellow-500 mr-1' />
          <span className="font-semibold text-info dark:text-base-content">{rating}</span>
        </div>
      </div>
      <div className="p-4 text-justify space-y-2">
        {
          user?.email === email ? <h1 className='text-2xl font-semibold text-center text-accent' >{serviceName}</h1>: ''
        }
        <p>{text}</p>
      </div>
      {
        user?.email === email ? <div className='pt-5 space-x-3'>
          <Link to={`/reviews/${_id}`} ><button type='btn' className='btn btn-accent mr-3 text-white bg-gradient-to-r from-info to-accent border-0 hover:shadow-lg hover:shadow-accent/40 hover:scale-[1.02]' >Edit</button></Link>
          <button onClick={()=>handleDelete(_id)} type='btn' className='btn btn-accent text-white bg-gradient-to-r from-info to-accent border-0 hover:shadow-lg hover:shadow-accent/40 hover:scale-[1.02]' >Delete</button>
        </div>:''
      }
    </div>
  );
};

export default Review;