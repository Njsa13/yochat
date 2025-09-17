import { useSearchParams } from "react-router-dom";

function SendVerificationEmail() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  return (
    <div className="bg-base-300 h-screen">
      <div className="flex flex-col items-center h-full pt-[68px] justify-center">
        <div className="bg-base-100 p-8 rounded-xl shadow-md text-center flex flex-col items-center gap-3">
          <h1 className="text-base-content/80 font-semibold text-xl font-roboto">Email Verification</h1>
          <div>
            <p className="text-base-content/50">
              Email successfully sent to <span className="font-semibold text-base-content/80">{email || "your.email@mail.com"}</span>
            </p>
            <p className="text-base-content/50">Please check your email to verify</p>
          </div>
          <button className="text-primary underline hover:opacity-80 transition-opacity duration-300" disabled={!email}>
            Send again
          </button>
        </div>
      </div>
    </div>
  );
}

export default SendVerificationEmail;
