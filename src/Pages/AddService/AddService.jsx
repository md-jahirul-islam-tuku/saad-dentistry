import React from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import useTitle from '../../hooks/useTitle';

const AddService = () => {
  useTitle('Add Service')
  const navigate = useNavigate();
  const handleAddService = e => {
    e.preventDefault();
    const form = e.target;
    const title = form.title.value;
    const image = form.image.value;
    const rating = form.rating.value;
    const price = form.price.value;
    const description = form.description.value;

    const service = {
      title: title,
      img: image,
      rating: rating,
      price: price,
      description: description
    }
    fetch(`http://localhost:5000/services`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(service)
    })
      .then(res => res.json())
      .then(data => {
        if (data?.acknowledged) {
          Swal.fire({
            position: 'top-center',
            icon: 'success',
            title: 'Your New Service added successfully',
            showConfirmButton: false,
            timer: 2000
          })
          form.reset();
          navigate('/services');
        }
      })
      .catch(err => console.error(err))

  }
  return (
    <div className='pt-32'>
      <form onSubmit={handleAddService} className="card-body w-11/12 md:w-3/5 lg:w-1/2 bg-gray-100 shadow-xl rounded-xl mx-auto mb-20 min-h-[80vh]">
        <h1 className='text-3xl font-bold pt-10 pb-5'>Add New Service</h1>
        <div className="form-control">
          <label className="label">
            <span className="label-text text-lg font-semibold">Title</span>
          </label>
          <input name='title' type="Text" placeholder="Title" className="input input-bordered" required />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text text-lg font-semibold">Image URL</span>
          </label>
          <input name='image' type="Text" placeholder="Image URL" className="input input-bordered" required />
        </div>
        <div className='flex gap-3'>
          <div className="form-control w-1/2">
            <label className="label">
              <span className="label-text text-lg font-semibold">Rating</span>
            </label>
            <input name='rating' type="Text" placeholder="Rating" className="input input-bordered" required />
          </div>
          <div className="form-control w-1/2">
            <label className="label">
              <span className="label-text text-lg font-semibold">Price</span>
            </label>
            <input name='price' type="Text" placeholder="Price" className="input input-bordered" required />
          </div>
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text text-lg font-semibold">Description</span>
          </label>
          <input name='description' type="Text" placeholder="Description" className="input input-bordered" required />
        </div>
        <div className="form-control mt-6">
          <button type='submit' className="btn btn-info text-lg font-bold text-white">Add Service</button>
        </div>
      </form>
    </div>
  );
};

export default AddService;