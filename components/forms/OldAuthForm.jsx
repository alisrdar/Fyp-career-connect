// components/forms/AuthForm.jsx
"use client";
import React from "react";
import { useForm } from "react-hook-form";
import Button from "../Button"; 
import Link from "next/link";
import Image from "next/image";
import PasswordInput from "../ui/PasswordInput"; 

const AuthForm = ({
  title = "Auth Form",
  btnText = "Submit",
  fields = [],
  onSubmit,
  redirectText,
  redirectHref,
  onSuccess
}) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  const handleFormSubmit = async (data) => {
    await onSubmit(data, setError);
    if (onSuccess) onSuccess(reset); // Reset only if no errors
  };

  return (
    <div className="max-w-md w-100 mx-auto bg-transparent dark:bg-surface p-8  rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        {title}
      </h2>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      {fields.map(({ name, label, type = "text", validation, placeholder }) => (
        <div key={name}>
          {type === "password" ? (
            <PasswordInput
              id={name}
              label={label}
              name={name}
              register={register}
              validation={validation}
              error={errors[name]}
            />
          ) : (
            <div className="flex flex-col">
              <label
                htmlFor={name}
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                {label}
              </label>
              <input
                id={name}
                type={type}
                {...register(name, validation)}
                placeholder={placeholder}
                className="p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-background-light dark:bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors[name] && (
                <span className="text-red-500 text-xs mt-1">{errors[name].message}</span>
              )}
            </div>
          )}
        </div>
      ))}

            
        {errors.blocked && (
          <p className="text-red-500 text-xs mt-1">{errors.blocked.message}</p>
        )}
        <Button 
          btnText={isSubmitting ? "Loading..." : btnText} 
          variant="primary" 
          className="w-full bg-secondary" 
          disabled={isSubmitting}
          type="submit"
        />
        
      </form>
      <p className="text-center  text-sm text-gray-700 dark:text-300 my-1">or {title} with </p>
      <div className="flex justify-center gap-2 mt-4 ">
        <Button
          btnText={
            <Image
              src="/icons/Google.svg"
              alt="Google"
              width={20}
              height={20}
              className="w-5 h-5 mx-auto"
            />
          }
          type="button"
          onClick={() => console.log("Google Sign In")}
          variant="ghost"
          className="w-full border border-primary"
        />
          
        
        <Button
          btnText={
            <Image
              src="/icons/Facebook.svg"
              alt="Facebook"
              width={20}
              height={20}
              className="w-5 h-5 mx-auto"
            />
          }
          variant="ghost"
          type="button"
          onClick={() => console.log("Facebook Sign In")}
          className="w-full border border-primary"
        />
      </div>
     

      {redirectText && redirectHref && (
        
          <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-2">
            {redirectText}{" "}
            <Link href={redirectHref} className="text-primary hover:underline">
              {btnText === "Reset Password" ? "Go back" : "Log In"}
            </Link>
          </p>
        
      )}
    </div>
  );
};


export default AuthForm;


