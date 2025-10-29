"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { MOCK_USERS } from "@/constants/mockUsers";
import { User, useUserStore } from "@/store/userStore";

const formSchema = z.object({
  username: z.string().min(1, "Username wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
});

export default function LoginPage() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (user) {
      if (user.role === "admin") router.push("/admin");
      else if (user.role === "applicant") router.push("/applicant");
    }
  }, [user, router]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const { username, password } = values;

    const user = MOCK_USERS.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      useUserStore.getState().setUser(user as User);

      if (user.role === "admin") {
        router.push("/admin");
      } else if (user.role === "applicant") {
        router.push("/applicant");
      }
    } else {
      form.setError("password", { message: "Username atau password salah" });
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-neutral-20">
      <div className="flex flex-col items-center justify-center w-[90vw] max-w-[500px]">
        <div className="w-full flex items-start">
          <Image src={"/Logo-1.png"} width={145} height={50} alt="Logo" />
        </div>
        <Card className="w-full shadow bg-neutral-10 border-0 rounded-none py-10 ">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader className="px-10">
                <CardTitle className=" text-xl font-semibold">
                  Masuk ke HiringPlatform
                </CardTitle>
                <CardDescription className="text-sm">
                  Belum punya akun?{" "}
                  <span className="text-primary cursor-default">
                    Daftar menggunakan email
                  </span>
                </CardDescription>
              </CardHeader>

              <CardContent className="px-10">
                <div className="my-4 space-y-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="">Username</FormLabel>
                        <FormControl>
                          <Input placeholder="admin / applicant" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4 w-full px-10">
                <Button type="submit" className="w-full" variant={"secondary"}>
                  Sign In
                </Button>
                <div className="flex items-center w-full">
                  <div className="flex-1 h-px bg-neutral-60"></div>
                  <span className="px-3 text-neutral-60 text-sm">or</span>
                  <div className="flex-1 h-px bg-neutral-60"></div>
                </div>
                <Button
                  variant={"outline"}
                  className="w-full border border-neutral-40 shadow-none cursor-default"
                  onClick={() => {}}
                >
                  <EnvelopeIcon />
                  Send login link through email
                </Button>
                <Button
                  variant={"outline"}
                  className="w-full border border-neutral-40 shadow-none cursor-default"
                  onClick={() => {}}
                >
                  <Image
                    src="/icon-google.svg"
                    width={16}
                    height={16}
                    alt="Google Icon"
                  />
                  Login with Google
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}
