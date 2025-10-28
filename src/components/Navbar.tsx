"use client";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useUserStore } from "@/store/userStore";

export default function Navbar() {
  const { user, logout } = useUserStore();
  const router = useRouter();

  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);

  return (
    <header className="w-full bg-white border-b border-neutral-40 shadow-sm px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {
          <div className="px-6 py-2">
            {pathname !== "/login" && (
              <Breadcrumb>
                <BreadcrumbList>
                  {segments.map((segment, index) => {
                    const href = "/" + segments.slice(0, index + 1).join("/");
                    const isLast = index === segments.length - 1;

                    return (
                      <React.Fragment key={href}>
                        <BreadcrumbItem>
                          {isLast ? (
                            <Button
                              className="capitalize bg-neutral-30 border-neutral-50 border text-neutral-100"
                              variant={"outline"}
                            >
                              {segment}
                            </Button>
                          ) : (
                            <BreadcrumbLink asChild>
                              <Link href={href}>
                                <Button
                                  className="capitalize bg-neutral-10 border border-neutral-40 shadow"
                                  variant={"outline"}
                                >
                                  {segment}
                                </Button>
                              </Link>
                            </BreadcrumbLink>
                          )}
                        </BreadcrumbItem>

                        {!isLast && <BreadcrumbSeparator />}
                      </React.Fragment>
                    );
                  })}
                </BreadcrumbList>
              </Breadcrumb>
            )}
          </div>
        }
      </div>

      {user && (
        <Popover>
          <PopoverTrigger asChild>
            <Button className="relative w-10 h-10 rounded-full overflow-hidden border">
              <Image
                src={"/avatar-placeholder.png"}
                alt="User Avatar"
                fill
                className="object-cover"
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-52 p-4 border rounded-lg shadow-xl">
            <div className="flex flex-col gap-2">
              <div>
                <h2 className="font-semibold">{user?.name}</h2>
                <p className="text-sm text-neutral-500">
                  Role : {user?.role.toLocaleUpperCase()}
                </p>
              </div>
              <Button
                variant="secondary"
                onClick={logout}
                className="w-full text-sm font-medium hover:bg-primary hover:text-white transition-colors"
              >
                Logout
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </header>
  );
}
