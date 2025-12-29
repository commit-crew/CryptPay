// "use client";

// const Signin = () => {
//   return (
//     <div className='w-full md:w-[58%] h-full flex flex-col'>
//         <div></div>
//         <div></div>
//         <div></div>
//     </div>
//   )
// }

// export default Signin

"use client";

import * as React from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signinSchema } from "@/lib/schemas";
import { numanFont } from "@/app/fonts";

export default function Signin() {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: signinSchema,
    },
    onSubmit: async ({ value }) => {
      toast("You submitted the following values:", {
        description: (
          <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
            <code>{JSON.stringify(value, null, 2)}</code>
          </pre>
        ),
        position: "bottom-right",
        classNames: {
          content: "flex flex-col gap-2",
        },
        style: {
          "--border-radius": "calc(var(--radius)  + 4px)",
        } as React.CSSProperties,
      });
    },
  });

  return (
    <div className="w-full md:w-[58%] h-full flex flex-col justify-evenly items-center">
      <div className={numanFont.className + " text-[30px] text-[#6750A4] w-[300px] md:w-[400px] lg:w-[500px]"}>
        CryptoPay
      </div>
      <div className="flex flex-col gap-20">
        <div className="text-[26px]">Sign in</div>
        <div>
          <form
            id="bug-report-form"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="w-[300px] md:w-[400px] lg:w-[500px] flex flex-col gap-8"
          >
            <FieldGroup>
              <div className="bg-[#E5DBFF] p-3 rounded-3xl">
                <form.Field
                  name="email"
                  children={(field) => {
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
                />
              </div>
            </FieldGroup>
            <FieldGroup>
              <div className="bg-[#E5DBFF] px-4 py-3 rounded-xl">
                <form.Field
                  name="password"
                  children={(field) => {
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
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />
              </div>
            </FieldGroup>
          </form>
          <div>New User ?</div>
        </div>
      </div>
      <div></div>
    </div>
  );
}
