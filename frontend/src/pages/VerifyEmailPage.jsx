import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useVerifyEmailMutation } from "../services/authApi";

function VerifyEmailPage() {
  const [formData, setFormData] = useState({
    token: "",
  });
  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  useEffect(() => {
    setFormData({ token });
  }, [token]);

  const verifyHandler = async (e) => {
    e.preventDefault();
    await verifyEmail(formData);
  };

  return (
    <div className="bg-base-300 h-screen">
      <div className="flex flex-col items-center h-full pt-[68px] justify-center">
        <div className="bg-base-100 p-8 rounded-xl shadow-md text-center flex flex-col gap-3">
          <h1 className="text-base-content/80 font-semibold text-xl font-roboto">
            Email Verification
          </h1>
          <form className="flex flex-col gap-4" onSubmit={verifyHandler}>
            <div className="form-control max-w-md lg:min-w-sm w-full">
              <div className="input w-full flex items-center rounded-lg">
                <input
                  id="token"
                  className="text-center"
                  value={formData.token}
                  onChange={(e) => {
                    setFormData({ ...formData, token: e.target.value });
                  }}
                  autoComplete="on"
                  type="text"
                  placeholder="Enter your token here"
                />
              </div>
            </div>
            <div className="form-control max-w-md lg:min-w-sm w-full">
              <button
                className="font-medium rounded-lg btn btn-primary w-full text-[#212121] font-roboto"
                disabled={!formData.token || isLoading}
              >
                {isLoading ? "Loading..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmailPage;
