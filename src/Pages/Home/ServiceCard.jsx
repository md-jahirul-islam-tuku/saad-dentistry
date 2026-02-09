import React from 'react';
import { FaStar, FaLongArrowAltRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import PhotoViewer from '../Shared/PhotoViewer';

const ServiceCard = ({ info }) => {
  const { _id, title, img, rating, price, description } = info;
  return (
    <div className="card bg-accent shadow-xl rounded-lg mb-3 md:mb-0">
      <figure>
        <PhotoViewer image={img}/>
      </figure>
      <div className="card-body text-white">
        <div className='flex justify-between font-semibold text-yellow-400 text-lg'><h4>Price: <span className='text-white'>${price}</span></h4><h4 className='flex items-center gap-1'><FaStar className='text-yellow-400' /> <span className='text-white'>{rating}</span></h4></div>
        <h2 className="card-title text-3xl font-normal">{title}</h2>
        <p className='text-left font-normal'>{description.slice(0, 100)} <span className='font-semibold'>. . .</span></p>
        <div className="card-actions justify-start">
          <Link to={`/services/${_id}`}>
            <button className="btn btn-sm btn-info font-bold text-white hover:bg-gradient-to-r from-info to-accent border-0">Details <FaLongArrowAltRight className='ml-3' /></button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;