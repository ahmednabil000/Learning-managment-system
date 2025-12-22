import { Link } from "react-router-dom";
import Button from "./Button";
import { HiOutlineHome, HiOutlineExclamationCircle } from "react-icons/hi";

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="text-center max-w-md w-full">
        <div className="relative inline-block mb-8">
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl transform scale-150"></div>
          <p className="text-9xl font-black text-primary/10 select-none">404</p>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <HiOutlineExclamationCircle className="w-24 h-24 text-primary" />
          </div>
        </div>

        <h1 className="heading-l text-text-main mb-4">Page Not Found</h1>
        <p className="text-text-muted mb-8 text-lg">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/">
            <Button variant="primary" className="flex items-center gap-2">
              <HiOutlineHome className="w-5 h-5" />
              Back to Home
            </Button>
          </Link>
          <Button variant="ghost" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
