import { Mail, Lock, User, UserRoundPen } from "lucide-react";

import AuthPageLogo from "../components/AuthPageLogo.jsx";

function SignUpPage() {
  return (
    <div className="bg-base-100 grid grid-cols-1 lg:grid-cols-2">
      <div className="flex flex-col mt-12 items-center justify-center px-6 py-12 sm:px-30 gap-6">
        <div className="head flex flex-col items-center gap-2">
          <h1 className="font-roboto font-semibold text-2xl text-base-content">Join Now</h1>
          <p className="text-base-content/60">Get started with your free account</p>
        </div>
        <form className="form w-full flex flex-col items-center gap-6">
          <div className="form-control max-w-md lg:min-w-sm w-full">
            <label htmlFor="username" className="label mb-2">
              <span className="font-roboto text-sm font-medium">Username</span>
            </label>
            <div className="input w-full flex items-center rounded-lg">
              <User size={20} className="opacity-50" />
              <input id="username" autoComplete="on" type="text" placeholder="your username" />
            </div>
          </div>
          <div className="form-control max-w-md lg:min-w-sm w-full">
            <label htmlFor="fullname" className="label mb-2">
              <span className="font-roboto text-sm font-medium">Full Name</span>
            </label>
            <div className="input w-full flex items-center rounded-lg">
              <UserRoundPen size={20} className="opacity-50" />
              <input id="fullname" autoComplete="on" type="text" placeholder="your full name" />
            </div>
          </div>
          <div className="form-control max-w-md lg:min-w-sm w-full">
            <label htmlFor="email" className="label mb-2">
              <span className="font-roboto text-sm font-medium">Email</span>
            </label>
            <div className="input w-full flex items-center rounded-lg">
              <Mail size={20} className="opacity-50" />
              <input id="email" autoComplete="on" type="email" placeholder="your.email@email.com" />
            </div>
          </div>
          <div className="form-control max-w-md lg:min-w-sm w-full">
            <label htmlFor="password" className="label mb-2">
              <span className="font-roboto text-sm font-medium">Password</span>
            </label>
            <div className="input w-full flex items-center rounded-lg">
              <Lock size={20} className="opacity-50" />
              <input id="password" autoComplete="on" type="password" placeholder="your password" />
            </div>
          </div>
          <div className="form-control max-w-md lg:min-w-sm w-full">
            <button className="font-medium rounded-lg btn btn-primary w-full text-[#212121] font-roboto">Create Account</button>
          </div>
          <div className="form-control max-w-md lg:min-w-sm w-full">
            <button className="font-medium rounded-lg btn bg-white hover:bg-[#e0e0e0] text-[#212121] border-black/30 w-full font-roboto">
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="15" height="15" viewBox="0 0 48 48">
                <path
                  fill="#FFC107"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                ></path>
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
              </svg>
              Sign up with Google
            </button>
          </div>
        </form>
        <div>
          <p>
            Already have an account?{" "}
            <a href="" className="text-primary underline hover:opacity-80 transition-opacity duration-300">
              Sign in
            </a>
          </p>
        </div>
      </div>
      <AuthPageLogo />
    </div>
  );
}

export default SignUpPage;
