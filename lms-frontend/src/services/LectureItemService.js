import api from "./api";

const LectureItemService = {
  updateItemsOrder: async (lectureId, updatesItems) => {
    const response = await api.put(`/lecture-items/order/${lectureId}`, {
      updatesItems,
    });
    return response.data;
  },
};

export default LectureItemService;
