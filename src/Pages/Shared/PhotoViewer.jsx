import React from 'react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

const PhotoViewer = ({ image }) => {
  return (
    <PhotoProvider maskOpacity={0.8} speed={() => 800}
      easing={(type) => (type === 3 ? 'cubic-bezier(0.36, 0, 0.66, -0.56)' : 'cubic-bezier(0.34, 1.56, 0.64, 1)')}
    >
      <PhotoView src={image}>
        <img src={image} alt="img" style={{ objectFit: 'cover' }} className="block object-cover object-center w-full rounded-t-md h-72 bg-gray-500" />
      </PhotoView>
    </PhotoProvider>
  );
};

export default PhotoViewer;