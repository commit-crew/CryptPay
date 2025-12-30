"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import toast from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { numanFont } from "@/app/fonts";
import { signupSchema } from "@/lib/schemas";
import { UnifiedWalletButton, useWallet } from "@jup-ag/wallet-adapter";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { signUp } from "@/lib/user";

export default function SignUp() {
  const { publicKey } = useWallet();
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    validators: {
      onSubmit: signupSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        if(!publicKey) {
          return toast({ title: "Please Connect wallet", description: "" })
        }
        console.log(value);
        const { name, email, password } = value;
        await signUp(name, email, password, publicKey.toString());
        toast({
          title: "Signed Up",
          description: "",
        });
        router.push('/signin');
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Sign up failed";
        toast({
          title: "Sign Up Failed",
          description: errorMessage,
        });
      }
    },
  });

  React.useEffect(() => {
    if(localStorage.getItem("authToken")) return router.push("/cryptopay");
  }, [router])

  return (
    <section className="w-full md:w-[58%] min-h-full flex flex-col justify-evenly items-center gap-5">
      <div
        className={
          numanFont.className +
          " text-[36px] text-[#6750A4] w-[300px] md:w-[360px] lg:w-[450px] xl:w-[500px] xl:my-6"
        }
      >
        CryptoPay
      </div>
      <div className="flex flex-col gap-7 xl:gap-9">
        <div className="text-[26px]">Sign up</div>
        <div>
          <form
            id="bug-report-form"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="w-[300px] md:w-[360px] lg:w-[450px] xl:w-[500px] flex flex-col gap-8"
          >
            <FieldGroup>
              <div className="bg-[#E5DBFF] p-3 rounded-3xl">
                <form.Field name="name">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          className="focus:ring-0 border-none shadow-none focus-visible:ring-0 p-0 text-[#6750A4]"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </div>
            </FieldGroup>
            <FieldGroup>
              <div className="bg-[#E5DBFF] p-3 rounded-3xl">
                <form.Field name="email">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          className="focus:ring-0 border-none shadow-none focus-visible:ring-0 p-0 text-[#6750A4]"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </div>
            </FieldGroup>
            <FieldGroup>
              <div className="bg-[#E5DBFF] px-4 py-3 rounded-3xl">
                <form.Field name="password">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          className="focus:ring-0 border-none shadow-none focus-visible:ring-0 p-0 text-[#6750A4]"
                          type="password"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </div>
            </FieldGroup>
            <div className="flex flex-col mt-4 gap-1">
              <div className="text-[14px]">
                <span>Already a User ?</span>
                <span
                  className="text-[#6750A4] ml-1 cursor-pointer"
                  onClick={() => router.push("/signin")}
                >
                  Sign In
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-3 items-center">
              <UnifiedWalletButton buttonClassName="px-5! py-4! bg-[#6750A4]! w-fit! rounded-full! font-semibold! text-white!" />
              <Button
                className="px-8 py-5 bg-[#6750A4] w-fit rounded-full font-semibold cursor-pointer text-black"
                type="submit"
              >
                Sign up
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
