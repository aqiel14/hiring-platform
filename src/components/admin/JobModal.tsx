"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Textarea } from "../ui/textarea";
import { Separator } from "../ui/separator";
import { useJobStore } from "@/store/jobStore";
import { ThreeStateToggle } from "../form/ThreeStatesToggle";
import { Label } from "../ui/label";
import LoadingSpinner from "../LoadingSpinner";
import { toast } from "sonner";

const fieldOptionEnum = z.enum(["mandatory", "optional", "off"]);

const formSchema = z
  .object({
    jobName: z.string().min(2, "Job name must be at least 2 characters"),
    jobType: z.string().min(2, "Job type is required"),
    jobDescription: z
      .string()
      .min(10, "Description must be at least 10 characters"),
    maxApplicants: z.coerce.number().min(1, "Must be at least 1"),
    minSalary: z.coerce.number().optional(),
    maxSalary: z.coerce.number().optional(),
    profileReqs: z.object({
      full_name: fieldOptionEnum,
      profile_pic: fieldOptionEnum,
      gender: fieldOptionEnum,
      email: fieldOptionEnum,
      domicile: fieldOptionEnum,
      linkedin_link: fieldOptionEnum,
      phone_number: fieldOptionEnum,
      date_of_birth: fieldOptionEnum,
    }),
  })
  .refine(
    (data) =>
      data.minSalary === undefined ||
      data.maxSalary === undefined ||
      data.maxSalary >= data.minSalary,
    {
      message: "Maximum salary must be greater than or equal to minimum salary",
      path: ["maxSalary"],
    }
  );

interface JobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function JobModal({ isOpen, onClose, onSuccess }: JobModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const addJob = useJobStore((state) => state.addJob);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      jobName: "",
      jobType: "",
      jobDescription: "",
      maxApplicants: undefined,
      minSalary: undefined,
      maxSalary: undefined,
      profileReqs: {
        full_name: "mandatory",
        profile_pic: "mandatory",
        gender: "optional",
        domicile: "optional",
        email: "mandatory",
        phone_number: "optional",
        linkedin_link: "off",
        date_of_birth: "mandatory",
      },
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const newJob: any = {
      id: `job_${Date.now()}`,
      company: { id: 1, name: "HiringPlatform" },
      slug: values.jobName.toLowerCase().replaceAll(" ", "-"),
      title: values.jobName,
      status: "active",
      salary_range: {
        min: values.minSalary || undefined,
        max: values.maxSalary || undefined,
        currency: "IDR",
        display_text:
          values.minSalary && values.maxSalary
            ? `Rp${values.minSalary.toLocaleString()} - Rp${values.maxSalary.toLocaleString()}`
            : undefined,
      },
      list_card: {
        badge: "Active",
        started_on_text: `started on ${new Date().toLocaleDateString()}`,
        cta: "Manage Job",
      },
      profileReqs: values.profileReqs,
      maxApplicants: values.maxApplicants,
      jobType: values.jobType,
      jobDescription: values.jobDescription,
      createdAt: new Date().toISOString(),
    };

    setTimeout(() => {
      addJob(newJob);
      setIsLoading(false);
      onSuccess();
    }, 2000);
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-primary-foreground w-[90vw] sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b px-6 pb-4 -mx-6">
          <DialogTitle>Job Opening</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-2"
          >
            {isLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50">
                <LoadingSpinner />
              </div>
            )}
            <FormField
              control={form.control}
              name="jobName"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="inline-flex items-center gap-0.5">
                    Job Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Frontend Developer"
                      {...field}
                      error={!!fieldState.error}
                      errorMessage={fieldState.error?.message}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jobType"
              render={({ field, fieldState }) => (
                <FormItem className="w-full">
                  <FormLabel className="inline-flex items-center gap-0.5">
                    Job Type <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger
                        error={!!fieldState.error}
                        errorMessage={fieldState.error?.message}
                        className="w-full"
                      >
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-primary-foreground">
                      <SelectItem value="fulltime">Full-time</SelectItem>
                      <SelectItem value="parttime">Part-time</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jobDescription"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="inline-flex items-center gap-0.5">
                    Job Description <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex."
                      {...field}
                      error={!!fieldState.error}
                      errorMessage={fieldState.error?.message}
                      maxLength={500}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxApplicants"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="inline-flex items-center gap-0.5">
                    Number of Candidate Needed{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="Ex. 2"
                      {...field}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^\d*$/.test(val)) field.onChange(val);
                      }}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Separator className="border-t-2 border-dashed border-neutral-40 mt-2 " />

            <Label className="mt-6">Job Salary</Label>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <FormField
                control={form.control}
                name="minSalary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Estimated Salary</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1.5 text-gray-500">
                          Rp
                        </span>
                        <Input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          placeholder="7.000.000"
                          {...field}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (/^\d*$/.test(val)) field.onChange(val);
                          }}
                          className="pl-10"
                          value={field.value ?? ""}
                        />
                      </div>
                    </FormControl>
                    <div className="h-5"></div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxSalary"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Maximum Estimated Salary</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1.5 text-gray-500">
                          Rp
                        </span>
                        <Input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          placeholder="8.000.000"
                          {...field}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (/^\d*$/.test(val)) field.onChange(val);
                          }}
                          className={`pl-10 ${
                            fieldState.error && "border-danger"
                          }`}
                          value={field.value ?? ""}
                        />
                      </div>
                    </FormControl>
                    <div className="h-5">
                      {fieldState.error && (
                        <p className="text-red-500 text-sm mt-1">
                          {fieldState.error.message}
                        </p>
                      )}
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* --- Profile Requirements --- */}
            <div>
              <h3 className="font-semibold text-lg mt-6 mb-2">
                Minimum Profile Information Required
              </h3>
              <div className="">
                {Object.keys(form.getValues("profileReqs")).map((key) => (
                  <FormField
                    key={key}
                    control={form.control}
                    name={`profileReqs.${key}` as any}
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between border-b border-[#E0E0E0] p-2">
                          <FormLabel className="capitalize">
                            {key
                              .replaceAll("_", " ")
                              .split(" ")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() + word.slice(1)
                              )
                              .join(" ")}
                          </FormLabel>
                          <FormControl>
                            <ThreeStateToggle
                              value={field.value}
                              onChange={field.onChange}
                              mandatories={[
                                "full_name",
                                "profile_pic",
                                "date_of_birth",
                              ]}
                              fieldKey={key}
                            />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                Save Job
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
