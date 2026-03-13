import React from "react";
import { FaStar, FaLongArrowAltRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const ServiceCard = ({ info }) => {
  const { _id, title, img, rating, price, description } = info;

  return (
    <div className="card bg-info/10 rounded-t-lg rounded-b-none mb-4 md:mb-0">

      <figure>
        <img
          src={img}
          alt={title}
          className="w-full h-72 object-cover rounded-t-md"
        />
      </figure>

      <div className="card-body">

        {/* Price & Rating */}

        <div className="flex justify-between font-semibold text-accent text-lg">
          <h4>Price: ${price}</h4>

          <h4 className="flex items-center gap-1">
            <FaStar className="text-yellow-500" /> {rating}
          </h4>
        </div>

        {/* Title */}

        <h2 className="card-title text-3xl font-normal text-start">
          {title}
        </h2>

        {/* Description */}

        <p className="text-start">
          {description.slice(0, 65)}
          <span className="font-semibold">...</span>
        </p>

        {/* Details Button */}

        <div className="text-start mt-2">

          <Link to={`/services/${_id}`}>

            <button className="btn btn-sm text-white bg-gradient-to-r from-info to-accent border-0 hover:shadow-lg hover:shadow-accent/40 hover:scale-[1.02]">

              Details

              <FaLongArrowAltRight className="ml-2" />

            </button>

          </Link>

        </div>

      </div>
    </div>
  );
};

export default ServiceCard;