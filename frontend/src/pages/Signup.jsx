import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Signup = () => {
  const [step, setStep] = useState(1);
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
    if (!validateStep()) return;

    try {
      const res = await fetch("http://127.0.0.1:8000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Signup failed.");
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const stepVariants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 text-white">
      <div className="w-full max-w-lg bg-gray-800 rounded-2xl p-6 shadow-xl space-y-6">
        <h2 className="text-2xl font-semibold text-center">Institution Signup</h2>
        {error && <p className="text-red-400 text-center">{error}</p>}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-4"
            >
              <div>
                <label className="block mb-1">Institution Name</label>
                <input
                  name="institution_name"
                  value={form.institution_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded bg-gray-700 text-white"
                />
              </div>
              <div>
                <label className="block mb-1">Institution Domain</label>
                <input
                  name="institution_domain"
                  value={form.institution_domain}
                  onChange={handleChange}
                  placeholder="e.g. lcu.ng"
                  className="w-full px-4 py-2 rounded bg-gray-700 text-white"
                />
              </div>
              <div className="text-right">
                <button
                  onClick={handleNext}
                  className="bg-blue-600 px-6 py-2 rounded hover:bg-blue-700"
                >
                  Next →
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-4"
            >
              <div>
                <label className="block mb-1">Admin Name</label>
                <input
                  name="admin_name"
                  value={form.admin_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded bg-gray-700 text-white"
                />
              </div>
              <div>
                <label className="block mb-1">Admin Email</label>
                <input
                  name="admin_email"
                  type="email"
                  value={form.admin_email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded bg-gray-700 text-white"
                />
              </div>
              <div>
                <label className="block mb-1">Password</label>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded bg-gray-700 text-white"
                />
              </div>
              <div className="flex justify-between">
                <button
                  onClick={handleBack}
                  className="bg-gray-600 px-6 py-2 rounded hover:bg-gray-700"
                >
                  ← Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-green-600 px-6 py-2 rounded hover:bg-green-700"
                >
                  Create Account
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {success && (
          <div className="text-center text-green-400">
            🎉 Account created! You can now log in.
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;
