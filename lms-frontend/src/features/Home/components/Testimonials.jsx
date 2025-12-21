import { useTranslation } from "react-i18next";

const Testimonials = () => {
  const { t } = useTranslation();
  const testimonials = [
    {
      id: 1,
      quote:
        "This platform has completely transformed the way I learn. The courses are well-structured and the instructors are top-notch.",
      author: "Sarah Johnson",
      role: "Web Developer",
      avatar: "https://via.placeholder.com/150?text=S",
    },
    {
      id: 2,
      quote:
        "I was able to switch careers thanks to the data science track. The hands-on projects gave me the confidence I needed.",
      author: "Michael Chen",
      role: "Data Analyst",
      avatar: "https://via.placeholder.com/150?text=M",
    },
    {
      id: 3,
      quote:
        "The community support is amazing. Whenever I got stuck, there was always someone ready to help. Highly recommended!",
      author: "Emily Davis",
      role: "UX Designer",
      avatar: "https://via.placeholder.com/150?text=E",
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="heading-l text-primary mb-4">
            {t("testimonials.title")}
          </h2>
          <p className="body text-text-muted max-w-2xl mx-auto">
            {t("testimonials.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-surface p-8 rounded-xl shadow-sm border border-border relative"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-8 rtl:right-auto rtl:left-8 text-primary/10 text-6xl font-serif">
                "
              </div>

              <p className="body text-text-muted mb-6 relative z-10">
                {testimonial.quote}
              </p>

              <div className="flex items-center">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  className="h-12 w-12 rounded-full object-cover border-2 border-primary mr-4 rtl:mr-0 rtl:ml-4"
                />
                <div>
                  <h4 className="body font-semibold text-text-main">
                    {testimonial.author}
                  </h4>
                  <p className="text-xs text-text-muted">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
