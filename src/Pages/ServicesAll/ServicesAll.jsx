import React, { useEffect, useState } from 'react';
import ServiceCard from '../Home/ServiceCard';

const ServicesAll = () => {
  const [services, setServices] = useState([]);
  useEffect(() => {
    fetch('https://saad-dentistry-server.vercel.app/services')
      .then(res => res.json())
      .then(data => setServices(data))
  }, [])
  return (
    <div className='col-span-3 md:grid grid-cols-2 gap-2 md:gap-5 mb-20'>
      {
        services.map(service => <ServiceCard
          key={service._id}
          info={service}
        ></ServiceCard>)
      }
    </div>
  );
};

export default ServicesAll;