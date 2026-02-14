import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../AuthProvider/AuthProvider';
import useTitle from '../../hooks/useTitle';
import Review from './Review';
import Swal from 'sweetalert2';

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const { user, logOut } = useContext(AuthContext);
  useTitle('My reviews')
  useEffect(() => {
    fetch(`http://localhost:5000/reviews?email=${user?.email}`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('saad-token')}`
      }
    })
      .then(res => {
        if (res.status === 401 || res.status === 403) {
          return logOut();
        }
        return res.json()
      })
      .then(data => {
        setReviews(data)
        setRefresh(!refresh)
      })
  }, [user?.email, refresh, logOut])
  const handleDelete = id => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:5000/reviews/${id}`, {
          method: 'delete',
          headers: {
            authorization: `Bearer ${localStorage.getItem('saad-token')}`
          }
        })
          .then(res => res.json())
          .then(data => {
            if (data?.deletedCount > 0) {
              swalWithBootstrapButtons.fire(
                'Deleted!',
                'Your review has been deleted.',
                'success'
              )
            }
          })

      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Your imaginary review is safe :)',
          'error'
        )
      }
    })
  }
  return (
    <div className='pt-32 px-3 md:px-10 lg:px-56 min-h-screen lg:mb-10'>
      <div className=''>
        {
          reviews.slice(0).reverse().map(review => <Review
            key={review?._id}
            review={review}
            handleDelete={handleDelete}
          ></Review>)
        }
      </div>
      {
        reviews.length === 0 && <h1 className="text-3xl font-semibold text-gray-300" >No reviews were added</h1>
      }
    </div>
  );
};

export default MyReviews;