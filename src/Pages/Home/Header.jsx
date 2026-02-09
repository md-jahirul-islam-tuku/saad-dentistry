import React from 'react';
import icon1 from '../../Assets/Icons/3.png';
import icon2 from '../../Assets/Icons/2.png';
import icon3 from '../../Assets/Icons/1.png';

const Header = () => {
  return (
    <div className="carousel w-full pt-20">
      <div id="slide1" className="carousel-item relative w-full">
        <img alt="..." src="https://i.ibb.co/cN0jYNw/SaaD-1.jpg" className="w-full h-72 lg:h-full rounded-xl" />
        <div>
          <div className="absolute transform left-24 top-1/4 hidden md:block">
            <h1 className='text-5xl text-info font-bold text-left'>
              <span className='text-3xl text-accent'>Dr. Saad Abdallah Al Mohaymin</span> <br />
              Committed To <br />
              Excellence
            </h1>
            <div className='flex mt-3'>
              <div><img className='h-10 mr-2' src={icon1} alt="" /></div>
              <div className='text-left'>
                <h5 className='text-xl font-semibold'>Whitening</h5>
                <p className='w-44'>Completely iterate covalent strategic theme areas via accurate e-markets</p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute flex justify-center gap-2 transform -translate-y-1/2 left-5 right-5 bottom-0">
          <a href="#slide3" className="btn btn-sm lg:btn-md btn-circle btn-info hover:bg-gradient-to-r from-accent to-info border-0">❮</a>
          <a href="#slide2" className="btn btn-sm lg:btn-md btn-circle btn-info hover:bg-gradient-to-r from-info to-accent border-0">❯</a>
        </div>
      </div>
      <div id="slide2" className="carousel-item relative w-full">
        <img alt="..." src="https://i.ibb.co/CMLL6cH/SaaD-2.jpg" className="w-full h-72 lg:h-full rounded-xl" />
        <div>
          <div className="absolute transform left-24 top-1/4 hidden md:block">
            <h1 className='text-5xl text-info font-bold text-left'>
              <span className='text-3xl text-accent'>Also Committed To Excellence</span> <br />
              Personalized & <br />
              Comfortable
            </h1>
            <div className='flex mt-3'>
              <div><img className='h-10 mr-2' src={icon2} alt="" /></div>
              <div className='text-left'>
                <h5 className='text-xl font-semibold'>Full Protection</h5>
                <p className='w-44'>Competently parallel task researched data and process improvements</p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute flex justify-center gap-2 transform -translate-y-1/2 left-5 right-5 bottom-0">
          <a href="#slide1" className="btn btn-sm lg:btn-md btn-circle btn-info hover:bg-gradient-to-r from-accent to-info border-0">❮</a>
          <a href="#slide3" className="btn btn-sm lg:btn-md btn-circle btn-info hover:bg-gradient-to-r from-info to-accent border-0">❯</a>
        </div>
      </div>
      <div id="slide3" className="carousel-item relative w-full">
        <img alt="..." src="https://i.ibb.co/jwQVkCr/SaaD-3.jpg" className="w-full h-72 lg:h-full rounded-xl" />
        <div>
          <div className="absolute transform left-24 top-1/4 hidden md:block">
            <h1 className='text-5xl text-info font-bold text-left'>
              <span className='text-3xl text-accent'>Also Care For Lifetime</span> <br />
              Let Me Brighten <br />
              Your Smile
            </h1>
            <div className='flex mt-3'>
              <div><img className='h-10 mr-2' src={icon3} alt="" /></div>
              <div className='text-left'>
                <h5 className='text-xl font-semibold'>Alignment</h5>
                <p className='w-44'>Dynamically innovate resource leveling service for state of the art customer</p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute flex justify-center gap-2 transform -translate-y-1/2 left-5 right-5 bottom-0">
          <a href="#slide2" className="btn btn-sm lg:btn-md btn-circle btn-info hover:bg-gradient-to-r from-accent to-info border-0">❮</a>
          <a href="#slide1" className="btn btn-sm lg:btn-md btn-circle btn-info hover:bg-gradient-to-r from-info to-accent border-0">❯</a>
        </div>
      </div>
    </div>
  );
};

export default Header;