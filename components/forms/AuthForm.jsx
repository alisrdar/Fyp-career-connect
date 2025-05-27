// components/forms/AuthForm.jsx
"use client";
import React from "react";
import { useForm } from "react-hook-form";
import Button from "../ui/Button";
import Link from "next/link";
import Image from "next/image";
import PasswordInput from "../ui/PasswordInput"; // adjust path if needed 

const AuthForm = ({
  title = "Auth Form",
  btnText = "Submit",
  fields = [],
  onSubmit,
  redirectText,
  redirectHref,
  onSuccess,
  redirectLinkText,
  socialProviders = ["Google", "Facebook", "Apple"]
}) => {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const handleFormSubmit = async (data) => {
    const didSucceed = await onSubmit(data, setError);
    if (didSucceed) {
      if (onSuccess) onSuccess();
      reset();
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-10 py-8 rounded-3xl my-4 bg-white/10 backdrop-blur-lg shadow-xl border border-white/20 text-foreground-light dark:text-foreground-dark">
      <Link href="/" className="flex justify-center mb-4">
        <Image
          src="/pgec_logo_white_Svg.png" // Replace with your actual logo path
          alt="App Logo"
          width={50}
          height={50}
          className="hover:scale-105 transition-transform cursor-pointer"
        />
      </Link>
      <h2 className="text-3xl font-bold text-white text-center mb-6">
        {title}
      </h2>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
        {/* hidden register for formError */}
        <input type="hidden" {...register("formError")} />

        {fields.map(({ name, label, type = "text", validation, placeholder }) => (
          <div key={name}>
            {type === "password" ? (
              <>
                <PasswordInput
                  id={name}
                  label={label}
                  name={name}
                  register={register}
                  validation={validation}
                  error={errors[name]}
                />
                {btnText == "Login" && (
                  <div className="text-right mt-1">
                    <Link
                      href="/forgot-password"
                      className="text-sm text-blue-400 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col">
                <label
                  htmlFor={name}
                  className="text-sm font-medium text-white  dark:text-gray-300 mb-1"
                >
                  {label}
                </label>
                <input
                  id={name}
                  type={type}
                  {...register(name, validation)}
                  placeholder={placeholder}
                  className="p-2.5 rounded-xl border border-gray-300 bg-white/70 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary w-full"
                />
                {errors[name] && (
                  <span className="text-red-500 text-xs mt-1">{errors[name].message}</span>
                )}
              </div>
            )}
          </div>
        ))}

        {/* global form error */}
        {errors.formError && (
          <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm text-center mb-4">
            {errors.formError.message}
          </p>
        )}

        <Button
          btnText={isSubmitting ? "Loading..." : btnText}
          variant="primary"
          className="w-full"
          disabled={isSubmitting}
          type="submit"
        />

      </form>
      <p className="text-center  text-sm text-white/70 mt-2">or {title} with </p>
      <div className="flex max-w-3/4 mx-auto justify-center gap-4 mt-2">
        {socialProviders.map((provider) => (
          <Button
            key={provider}
            btnText={
              <Image
                src={`/icons/${provider}.svg`}
                alt="Facebook"
                width={20}
                height={20}
                className="w-5 h-5 mx-auto"
              />
            }
            variant="ghost"
            type="button"
            onClick={() => console.log("Facebook Sign In")}
            className="w-full  bg-white hover:bg-white/50 text-white rounded-3xl shadow-sm"
            size="md"
          />

        ))}
      </div>

      {redirectText && redirectHref && (

        <p className="text-center text-sm text-white mt-6">
          {redirectText}{" "}
          <Link href={redirectHref} className="text-primary hover:underline">
            {btnText === "Reset Password" ? "Go back" : redirectLinkText}
          </Link>
        </p>

      )}
    </div>
  );
};


export default AuthForm;
