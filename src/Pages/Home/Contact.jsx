import React from 'react';
import icon1 from '../../Assets/Icons/contact/calender.png';
import icon2 from '../../Assets/Icons/contact/phone.png';
import icon3 from '../../Assets/Icons/contact/location.png';
import icon from '../../Assets/Icons/logo.png';

const Contact = () => {
  return (
    <div className='bg-primary/10 pb-20 text-info rounded-lg my-20'>
      <div className='py-10'>
        <h1 className='text-3xl font-bold'>Contact with me</h1>
        <img className='h-8 lg:h-10 mx-auto my-2' src={icon} alt="" />
      </div>
      <div className='lg:flex lg:justify-around'>
        <div className='lg:flex items-center'>
          <div className='flex justify-center'><img src={icon1} alt="" className='lg:mr-4 h-14 lg:ml-0' /></div>
          <div className='lg:text-left'>
            <h5 className='text-lg'>Monday-Friday</h5>
            <h2 className='text-3xl'>9:00 am - 12:00 am</h2>
          </div>
        </div>
        <div className='lg:flex items-center my-10 lg:my-0'>
          <div className='flex justify-center'><img src={icon2} alt="" className='lg:mr-4 h-14 lg:ml-0' /></div>
          <div className='lg:text-left'>
            <h5 className='text-lg'>Emergency Phone</h5>
            <h2 className='text-3xl'>+966507169939</h2>
          </div>
        </div>
        <div className='lg:flex items-center'>
          <div className='flex justify-center'><img src={icon3} alt="" className='lg:mr-4 h-14 lg:ml-0' /></div>
          <div className='lg:text-left'>
            <h5 className='text-lg'>Address</h5>
            <h2 className='text-3xl'>Madinah, KSA</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;