import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { stripePromise } from "../../../utils/stripe";
import { useQueryClient } from "@tanstack/react-query";
import PageLoader from "../../../Loader/PageLoader";

const CheckoutForm = () => {
  const { id } = useParams();
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [appointment, setAppointment] = useState([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/appointment/${id}`,
          {
            headers: {
              authorization: `Bearer ${localStorage.getItem("saad-token")}`,
            },
          },
        );

        const foundData = await res.json();

        if (!res.ok) {
          throw new Error(foundData.message);
        }

        setAppointment(foundData);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: error.message,
          timer: 1500,
          showConfirmButton: false,
          customClass: {
            popup:
              "bg-base-100 dark:bg-slate-900 dark:text-base-content rounded-xl",
          },
        });
      }
    };

    fetchAppointments();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Payment Failed",
        text: error.message,
        timer: 1500,
        showConfirmButton: false,
        customClass: {
          popup:
            "bg-base-100 dark:bg-slate-900 dark:text-base-content rounded-xl",
        },
      });
      setLoading(false);
      return;
    }

    if (paymentIntent.status === "succeeded") {
      // 🔥 Store payment in DB
      await fetch(`${process.env.REACT_APP_API_BASE_URL}/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("saad-token")}`,
        },
        body: JSON.stringify({
          appointmentId: appointment._id,
          paymentIntentId: paymentIntent.id,
          customerName: appointment.name,
          customerEmail: appointment.email,
        }),
      });

      queryClient.invalidateQueries({
        queryKey: ["appointments"],
      });

      Swal.fire({
        icon: "success",
        title: "Payment Successful 🎉",
        text: `Transaction ID: ${paymentIntent.id}`,
        timer: 1500,
        showConfirmButton: false,
        customClass: {
          popup:
            "bg-base-100 dark:bg-slate-900 dark:text-base-content rounded-xl",
        },
      }).then(() => {
        navigate("/dashboard/my-appointments");
      });
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <button
        disabled={!stripe || loading}
        className="btn w-full btn-info font-bold text-lg text-white bg-gradient-to-r from-info to-accent border-0 hover:shadow-lg hover:shadow-accent/40 hover:scale-[1.02]"
      >
        {loading ? "Processing..." : `Pay Now $${appointment.price}`}
      </button>
    </form>
  );
};

const Checkout = () => {
  const { id } = useParams();
  const [checkoutAppointment, setCheckoutAppointment] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 1️⃣ Get appointment
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/appointment/${id}`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem("saad-token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCheckoutAppointment(data);
        setLoading(false);
      });
  }, [id]);

  // 🔹 2️⃣ Create PaymentIntent
  useEffect(() => {
    if (!checkoutAppointment) return;

    fetch(`${process.env.REACT_APP_API_BASE_URL}/create-payment-intent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("saad-token")}`,
      },
      body: JSON.stringify({
        serviceId: checkoutAppointment.serviceId,
        customerName: checkoutAppointment.name,
        customerEmail: checkoutAppointment.email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
      });
  }, [checkoutAppointment]);

  if (loading || !clientSecret) return <PageLoader />;

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-info/10 p-6 border-2 border-primary/30 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-center">
        Pay: ${checkoutAppointment.price}
      </h2>

      <div className="bg-base-100 dark:bg-info/20 p-4 rounded-lg">
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm appointment={checkoutAppointment} />
        </Elements>
      </div>
    </div>
  );
};

export default Checkout;
