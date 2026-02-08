import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const ServicesTable = () => {
  const [services, setServices] = useState([]);
  useEffect(() => {
    fetch('http://localhost:5000/services')
      .then(res => res.json())
      .then(data => setServices(data))
  }, [])
  return (
    <div className="overflow-x-auto col-span-1 mb-5 md:mb-0 md:mr-5">
      <h1 className='text-3xl font-bold text-info my-4'>Total services {services.length}</h1>
      <div>
        {
          services.map(service => {
            return (
              <div key={service._id}>
                <Link to={`/services/${service._id}`} ><button className='bg-accent w-full text-left text-white p-4 rounded-lg mb-1 font-semibold text-xl'>{service.title}</button></Link>
              </div>
            )
          })
        }
      </div>
    </div>
  );
};

export default ServicesTable;