import api from "./api";

const createPaymentIntent = async (courseId) => {
  const response = await api.post("/payments/create-payment-intent", {
    courseId,
  });
  return response.data;
};

const enrollUserInCourse = async (courseId) => {
  const response = await api.post("/payments/success-payment", {
    courseId,
  });
  return response.data;
};

const createTrackPaymentIntent = async (trackId) => {
  const response = await api.post("/payments/create-track-payment-intent", {
    trackId,
  });
  return response.data;
};

const enrollUserInTrack = async (trackId) => {
  const response = await api.post("/payments/success-track-payment", {
    trackId,
  });
  return response.data;
};

export default {
  createPaymentIntent,
  enrollUserInCourse,
  createTrackPaymentIntent,
  enrollUserInTrack,
};
