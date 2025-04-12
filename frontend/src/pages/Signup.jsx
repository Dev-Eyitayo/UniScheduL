import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ClipLoader } from "react-spinners";

const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    institution_name: "",
    institution_domain: "",
    admin_name: "",
    admin_email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateStep = () => {
    if (step === 1 && (!form.institution_name || !form.institution_domain)) {
      setError("Please fill in all institution details.");
      return false;
    }
    if (
      step === 2 &&
      (!form.admin_name || !form.admin_email || !form.password)
    ) {
      setError("Please fill in all admin details.");
      return false;
    }
    if (
      step === 2 &&
      !form.admin_email.endsWith(`@${form.institution_domain}`)
    ) {
      setError("Admin email must match the institution domain.");
      return false;
    }
    setError("");
    return true;
  };

  const handleNext = () => {
    if (validateStep()) setStep(step + 1);
  };

  const handleBack = () => {
    setError("");
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (!validateStep()) return;

    try {
      const res = await fetch("http://127.0.0.1:8000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Signup failed.");
      }

      // ✅ Save tokens + user info
      localStorage.setItem("access", data.tokens.access);
      localStorage.setItem("refresh", data.tokens.refresh);
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ Show success message
      setSuccess(true);

      // ✅ Redirect to dashboard after short delay
      setTimeout(() => {
        navigate("/admin");
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const stepVariants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  };

  return (
    <div className='min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 text-white'>
      <div className='w-full max-w-lg bg-gray-800 rounded-2xl p-6 shadow-xl space-y-6'>
        <h2 className='text-2xl font-semibold text-center'>
          Institution Signup
        </h2>
        {error && <p className='text-red-400 text-center'>{error}</p>}

        <AnimatePresence mode='wait'>
          {step === 1 && (
            <motion.div
              key='step1'
              variants={stepVariants}
              initial='initial'
              animate='animate'
              exit='exit'
              className='space-y-4'
            >
              <div>
                <label className='block mb-1'>Institution Name</label>
                <input
                  name='institution_name'
                  value={form.institution_name}
                  onChange={handleChange}
                  className='w-full px-4 py-2 rounded bg-gray-700 text-white'
                />
              </div>
              <div>
                <label className='block mb-1'>Institution Domain</label>
                <input
                  name='institution_domain'
                  value={form.institution_domain}
                  onChange={handleChange}
                  placeholder='e.g. lcu.ng'
                  className='w-full px-4 py-2 rounded bg-gray-700 text-white'
                />
              </div>
              <div className='text-right'>
                <button
                  onClick={handleNext}
                  className='bg-blue-600 px-6 py-2 rounded hover:bg-blue-700'
                >
                  Next →
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key='step2'
              variants={stepVariants}
              initial='initial'
              animate='animate'
              exit='exit'
              className='space-y-4'
            >
              <div>
                <label className='block mb-1'>Admin Name</label>
                <input
                  name='admin_name'
                  value={form.admin_name}
                  onChange={handleChange}
                  className='w-full px-4 py-2 rounded bg-gray-700 text-white'
                />
              </div>
              <div>
                <label className='block mb-1'>Admin Email</label>
                <input
                  name='admin_email'
                  type='email'
                  value={form.admin_email}
                  onChange={handleChange}
                  className='w-full px-4 py-2 rounded bg-gray-700 text-white'
                />
              </div>
              <div>
                <label className='block mb-1'>Password</label>
                <input
                  name='password'
                  type='password'
                  value={form.password}
                  onChange={handleChange}
                  className='w-full px-4 py-2 rounded bg-gray-700 text-white'
                />
              </div>
              <div className='flex justify-between'>
                <button
                  onClick={handleBack}
                  className='bg-gray-600 px-6 py-2 rounded hover:bg-gray-700'
                >
                  ← Back
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`bg-green-600 px-6 py-2 rounded hover:bg-green-700 flex items-center justify-center gap-2 ${
                    loading ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? (
                    <ClipLoader color='#fff' size={20} />
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {success && (
        <div className='fixed inset-0 bg-black/80 flex items-center justify-center z-50'>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className='bg-gray-800 text-white p-6 rounded-xl shadow-lg text-center space-y-4 max-w-md w-full'
          >
            <div className='w-20 h-20 mx-auto bg-green-500 rounded-full flex items-center justify-center'>
              <span className='text-4xl'>✅</span>
            </div>
            <h3 className='text-xl font-bold text-green-400'>
              Account Created!
            </h3>
            <p className='text-sm text-gray-300'>
              Redirecting to your dashboard...
            </p>
            <button
              onClick={() => navigate("/admin")}
              className='bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded'
            >
              Go to Dashboard
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Signup;
