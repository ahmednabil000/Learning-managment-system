import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import PaymentsService from "../../services/PaymentsService";
import CoursesService from "../../services/CoursesService";
import { FaSpinner, FaLock, FaBookOpen } from "react-icons/fa";
import { useParams } from "react-router-dom";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const PaymentFormContent = ({ courseId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // React Hook Form usage
  const { handleSubmit } = useForm();

  const onSubmit = async () => {
    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/completion?courseId=${courseId}`,
      },
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message);
      } else {
        setMessage("An unexpected error occurred.");
      }
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="mb-4">
        <PaymentElement id="payment-element" />
      </div>

      <button
        type="submit"
        disabled={isProcessing || !stripe || !elements}
        className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-300 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
      >
        {isProcessing ? (
          <>
            <FaSpinner className="animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <FaLock />
            <span>Pay Now</span>
          </>
        )}
      </button>
      {message && (
        <div className="text-red-500 text-sm mt-3 text-center font-medium bg-red-50 p-2 rounded">
          {message}
        </div>
      )}
    </form>
  );
};

export default function CheckoutForm() {
  const { courseId } = useParams();

  // Fetch Course Details
  const {
    data: course,
    isLoading: isCourseLoading,
    isError: isCourseError,
  } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => CoursesService.fetchCourseById(courseId),
    enabled: !!courseId,
  });

  // Create Payment Intent
  const {
    data: paymentIntentData,
    isLoading: isPaymentLoading,
    isError: isPaymentError,
  } = useQuery({
    queryKey: ["paymentIntent", courseId],
    queryFn: () => PaymentsService.createPaymentIntent(courseId),
    enabled: !!courseId,
    staleTime: Infinity,
    retry: 1,
  });

  const isLoading = isCourseLoading || isPaymentLoading;
  const isError = isCourseError || isPaymentError;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-lg border border-gray-100 min-w-[300px]">
          <FaSpinner className="text-blue-500 animate-spin w-10 h-10 mb-4" />
          <p className="text-gray-500 font-medium">
            Preparing secure checkout...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-red-100 text-center">
          <p className="text-red-500 font-medium text-lg mb-2">
            Failed to load checkout details.
          </p>
          <p className="text-gray-400 text-sm">
            Please check your connection and try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  const options = {
    clientSecret: paymentIntentData?.clientSecret,
    appearance: {
      theme: "stripe",
      labels: "floating",
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 h-fit">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FaBookOpen className="text-blue-500" />
            Order Summary
          </h2>
          {course && (
            <div className="space-y-4">
              <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-100">
                {course.imageUrl ? (
                  <img
                    src={course.imageUrl}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image Available
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {course.title}
                </h3>
                <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                  {course.description}
                </p>
              </div>
              <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                <span className="text-gray-600 font-medium">Total</span>
                <span className="text-2xl font-bold text-blue-600">
                  ${course.price}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Payment Form */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">
            Secure Payment
          </h2>
          {paymentIntentData?.clientSecret && (
            <Elements options={options} stripe={stripePromise}>
              <PaymentFormContent courseId={courseId} />
            </Elements>
          )}
        </div>
      </div>
    </div>
  );
}
