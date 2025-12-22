import { Link } from "react-router-dom";
import Button from "./Button";
import { HiOutlineLockClosed, HiOutlineHome } from "react-icons/hi";

const NotAuthorized = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="text-center max-w-md w-full">
        <div className="relative inline-block mb-8">
          <div className="absolute inset-0 bg-error/10 rounded-full blur-3xl transform scale-150"></div>
          <div className="w-32 h-32 bg-error/5 rounded-full flex items-center justify-center mx-auto border-2 border-error/10">
            <HiOutlineLockClosed className="w-16 h-16 text-error" />
          </div>
        </div>

        <h1 className="heading-l text-text-main mb-4">Access Denied</h1>
        <p className="text-text-muted mb-8 text-lg">
          You don't have permission to access this page. Please contact your
          administrator if you believe this is an error.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/">
            <Button variant="primary" className="flex items-center gap-2">
              <HiOutlineHome className="w-5 h-5" />
              Back to Home
            </Button>
          </Link>
          <Link to="/auth/login">
            <Button variant="outline">Sign in with another account</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotAuthorized;
