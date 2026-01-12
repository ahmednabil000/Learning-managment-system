import React from "react";

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-surface p-8 sm:p-12 rounded-2xl shadow-sm border border-border">
        <h1 className="heading-xl text-primary mb-8 border-b border-border pb-4">
          Privacy Policy
        </h1>

        <div className="space-y-8 text-text-main leading-relaxed">
          <section>
            <h2 className="heading-m text-text-main mb-4">
              1. Information We Collect
            </h2>
            <p className="mb-4">
              We collect information you provide directly to us, such as when
              you create an account, enroll in a course, or contact us for
              support. This may include:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-text-muted">
              <li>Name and contact information (email address)</li>
              <li>Account credentials</li>
              <li>Payment information (processed securely by third parties)</li>
              <li>Course progress and performance data</li>
            </ul>
          </section>

          <section>
            <h2 className="heading-m text-text-main mb-4">
              2. How We Use Your Information
            </h2>
            <p className="mb-4">
              We use the collected information for various purposes, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-text-muted">
              <li>Providing and maintaining our services</li>
              <li>Processing transactions and enrollments</li>
              <li>
                Communicating with you about courses, updates, and promotions
              </li>
              <li>Personalizing your learning experience</li>
              <li>Improving our platform and developing new features</li>
            </ul>
          </section>

          <section>
            <h2 className="heading-m text-text-main mb-4">3. Data Security</h2>
            <p className="text-text-muted">
              We implement appropriate technical and organizational measures to
              protect your personal data against unauthorized access,
              alteration, disclosure, or destruction. However, no method of
              transmission over the Internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="heading-m text-text-main mb-4">
              4. Sharing of Information
            </h2>
            <p className="text-text-muted">
              We do not sell your personal data. We may share information with
              instructors related to courses you enroll in, or with third-party
              service providers who assist us in operating our platform (e.g.,
              payment processors, email services).
            </p>
          </section>

          <section>
            <h2 className="heading-m text-text-main mb-4">5. Contact Us</h2>
            <p className="text-text-muted">
              If you have any questions about this Privacy Policy, please
              contact us at support@edusphere.com.
            </p>
          </section>

          <p className="text-sm text-text-muted mt-8 pt-6 border-t border-border">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
