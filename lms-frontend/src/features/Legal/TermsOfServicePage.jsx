import React from "react";

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-surface p-8 sm:p-12 rounded-2xl shadow-sm border border-border">
        <h1 className="heading-xl text-primary mb-8 border-b border-border pb-4">
          Terms of Service
        </h1>

        <div className="space-y-8 text-text-main leading-relaxed">
          <section>
            <h2 className="heading-m text-text-main mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-text-muted">
              By accessing and using EduSphere, you agree to be bound by these
              Terms of Service and all applicable laws and regulations. If you
              do not agree with any of these terms, you are prohibited from
              using or accessing this site.
            </p>
          </section>

          <section>
            <h2 className="heading-m text-text-main mb-4">2. User Accounts</h2>
            <p className="mb-4">
              To access certain features of the platform, you must create an
              account. You agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-text-muted">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>
                Accept responsibility for all activities that occur under your
                account
              </li>
            </ul>
          </section>

          <section>
            <h2 className="heading-m text-text-main mb-4">
              3. Course Enrollment and Access
            </h2>
            <p className="text-text-muted">
              When you enroll in a course, you get a license from us to view it
              via the EduSphere services and no other use. You may not transfer
              or resell courses in any way. We grant you a lifetime access
              license, except when we must disable the course for legal or
              policy reasons.
            </p>
          </section>

          <section>
            <h2 className="heading-m text-text-main mb-4">4. User Content</h2>
            <p className="text-text-muted">
              Our platform allows you to post content, including messages,
              reviews, and questions. You retain all rights to, and are solely
              responsible for, the content you post. However, by posting
              content, you grant EduSphere a non-exclusive license to use,
              reproduce, and display such content.
            </p>
          </section>

          <section>
            <h2 className="heading-m text-text-main mb-4">
              5. Prohibited Conduct
            </h2>
            <p className="mb-4">You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2 text-text-muted">
              <li>Use the platform for any illegal purpose</li>
              <li>Harass, abuse, or harm another person</li>
              <li>Share your account credentials with others</li>
              <li>Attempt to reverse engineer or hack the platform</li>
            </ul>
          </section>

          <section>
            <h2 className="heading-m text-text-main mb-4">
              6. Limitation of Liability
            </h2>
            <p className="text-text-muted">
              EduSphere shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages, including without
              limitation, loss of profits, data, use, goodwill, or other
              intangible losses, resulting from your access to or use of or
              inability to access or use the service.
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

export default TermsOfServicePage;
