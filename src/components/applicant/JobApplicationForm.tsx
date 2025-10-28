"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useJobStore } from "@/store/jobStore";
import { ArrowLeftIcon, ArrowUpTrayIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import GestureWebcamModal from "../GestureWebcamModal";
import { useMemo, useState } from "react";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import PhoneNumberSelect from "../form/PhoneNumberSelect";
import { CustomCalendar } from "../form/CustomCalendar";
import DomicileInput from "../form/DomicileInput";
import GenderRadio from "../form/GenderRadio";
import { useJobApplicationStore } from "@/store/jobApplicationStore";
import { Job } from "@/types/job";
import { useRouter } from "next/navigation";
import { APPLICANT_USER } from "@/constants/mockUsers";
import { CircleCheckIcon } from "lucide-react";
import { toast } from "sonner";

const fieldOptionEnum = z.enum(["mandatory", "optional", "off"]);

const isValuePresent = (val: any) => {
  if (val === undefined || val === null) return false;
  if (typeof val === "string") return val.trim().length > 0;
  // for Date, number, object, etc. presence is enough
  return true;
};

const makeRequired = <T extends z.ZodTypeAny>(schema: T) =>
  schema.refine((v) => isValuePresent(v), { message: "Required" });

const buildSchema = (profileReqs: Record<string, string>) => {
  const schema: Record<string, any> = {};

  const addField = (key: string, condition: string, type: z.ZodTypeAny) => {
    if (condition === "off") return; // Skip entirely

    if (condition === "mandatory") {
      schema[key] = makeRequired(type);
    } else if (condition === "optional") {
      schema[key] = type.optional();
    }
  };

  addField(
    "profilePicture",
    profileReqs.profile_pic,
    z.string().url("Profile Picture Required").optional()
  );

  addField("fullName", profileReqs.full_name, z.string());
  addField("gender", profileReqs.gender, z.string());
  addField("domicile", profileReqs.domicile, z.string());
  addField("phoneNumber", profileReqs.phone_number, z.string());
  addField(
    "linkedinLink",
    profileReqs.linkedin_link,
    z
      .string()
      .refine(
        (val) =>
          val === "" ||
          /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/.test(
            val
          ),
        {
          message: "Invalid LinkedIn URL",
        }
      )
  );
  addField(
    "email",
    profileReqs.email,
    z
      .string()
      .refine((val) => val === "" || /\S+@\S+\.\S+/.test(val), "Invalid email")
      .optional()
  );

  // dateOfBirth: use z.date() but accept strings too via preprocess if your calendar returns a Date, otherwise adjust
  const dateSchema = z.preprocess((val) => {
    if (!val) return undefined;
    // if value is a string, try parse
    if (typeof val === "string") {
      const d = new Date(val);
      return isNaN(d.getTime()) ? val : d;
    }
    return val;
  }, z.date());

  addField("dateOfBirth", profileReqs.date_of_birth, dateSchema);

  return z.object(schema);
};

interface JobApplicationFormProps {
  jobId: String;
}
const JobApplicationForm = ({ jobId }: JobApplicationFormProps) => {
  const router = useRouter();
  const { jobs } = useJobStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedImage, setSavedImage] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState({
    name: "Indonesia",
    code: "+62",
    emoji: "🇮🇩",
  });

  const [isOpenSelectCountry, setIsOpenSelectCountry] = useState(false);
  const [isOpenDatePicker, setIsOpenDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const job = jobs.find((j) => j.id === jobId) as Job;

  const profileReqs = job?.profileReqs || {};

  // ✅ Dynamic schema
  const formSchema = useMemo(() => buildSchema(profileReqs), [profileReqs]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      dateOfBirth: new Date(),
      gender: "",
      domicile: "",
      phoneNumber: "",
      email: "",
      linkedinLink: "",
      profilePicture: "",
    },
  });

  console.log("job", job);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const addJobApplication =
      useJobApplicationStore.getState().addJobApplication;

    setIsLoading(true);

    setTimeout(() => {
      const newJobApplication = {
        id: crypto.randomUUID(),
        applicantId: APPLICANT_USER.id ?? "applicant_1",
        jobId: job.id as string,
        ...values,
        profilePicture: savedImage ?? undefined,
        createdAt: new Date().toISOString(),
      };

      addJobApplication(newJobApplication);
      console.log("Application saved:", newJobApplication);

      setIsLoading(false);
      setIsSubmitted(true);
      toast("🎉 Your application was sent!", {
        position: "bottom-left",
        icon: <CircleCheckIcon className="size-4 text-success" />,
        action: {
          label: "X",
          onClick: () => toast.dismiss(),
        },
      });
    }, 2000); // 2 seconds
  };

  const onUploadButton = (e: any) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-neutral-500 text-lg">Submitting application...</p>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="flex flex-col justify-center items-center w-[65%] text-center gap-4">
          <Image alt="Applied" src="/Applied.png" width={240} height={240} />
          <h2 className="text-bold text-2xl text-neutral-90 text-center">
            🎉 Your application was sent!
          </h2>
          <p className="font-normal text-md text-neutral-90 flex-wrap">
            Congratulations! You've taken the first step towards a rewarding
            career at HiringPlatform. We look forward to learning more about you
            during the application process.
          </p>
          <Button onClick={() => router.push("/applicant")}>
            Back to job list
          </Button>
        </div>
      </div>
    );
  }

  const isFieldVisible = (key: keyof typeof profileReqs) =>
    profileReqs[key] !== "off";
  const isMandatory = (key: keyof typeof profileReqs) =>
    profileReqs[key] === "mandatory";

  return (
    <>
      {job && (
        <div className="bg-neutral-10  flex flex-col items-center p-10 max-w-[65vh] w-full">
          <div className="flex w-full items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button onClick={() => router.back()} variant="back">
                <ArrowLeftIcon className="h-7 w-7" />
              </Button>
              <h2 className="font-bold text-lg">
                Apply {job.title} at {job.company?.name}
              </h2>
            </div>
            <p className="text-sm text-neutral-500">
              ℹ️ Required fields marked with *
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5 bg-white p-6 rounded-md w-full flex flex-col max-h-[80vh] overflow-y-auto"
            >
              {/* Profile Picture */}
              {isFieldVisible("profile_pic") && (
                <>
                  <FormField
                    control={form.control}
                    name="profilePicture"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>
                          Photo Profile{" "}
                          {isMandatory("profile_pic") && (
                            <span className="text-red-500">*</span>
                          )}
                        </FormLabel>

                        <div className="flex flex-col items-start gap-3">
                          <Image
                            width={128}
                            height={128}
                            alt="profile-photo"
                            src={savedImage || "/avatar-male.png"}
                            className="rounded-xl aspect-square object-cover border"
                          />

                          <Button
                            onClick={(e) => {
                              e.preventDefault();
                              setIsModalOpen(true);
                            }}
                            variant="outline"
                            type="button"
                          >
                            <ArrowUpTrayIcon className="size-4" /> Take a
                            picture
                          </Button>

                          {fieldState.error && (
                            <p className="text-red-500 text-sm">
                              {fieldState.error?.message}
                            </p>
                          )}
                        </div>
                      </FormItem>
                    )}
                  />
                </>
              )}

              {/* Full Name */}
              {isFieldVisible("full_name") && (
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>
                        Full name{" "}
                        {isMandatory("full_name") && (
                          <span className="text-red-500">*</span>
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your full name"
                          {...field}
                          error={!!fieldState.error}
                          errorMessage={fieldState.error?.message}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}

              {/* Date of Birth */}
              {isFieldVisible("date_of_birth") && (
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>
                        Date of birth{" "}
                        {isMandatory("date_of_birth") && (
                          <span className="text-red-500">*</span>
                        )}
                      </FormLabel>
                      <FormControl>
                        <CustomCalendar
                          field={field}
                          fieldState={fieldState}
                          isOpenDatePicker={isOpenDatePicker}
                          setIsOpenDatePicker={setIsOpenDatePicker}
                        />
                      </FormControl>
                      {fieldState?.error?.message}
                    </FormItem>
                  )}
                />
              )}

              {/* Gender */}
              {isFieldVisible("gender") && (
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>
                        Pronoun (gender){" "}
                        {isMandatory("gender") && (
                          <span className="text-red-500">*</span>
                        )}
                      </FormLabel>
                      <FormControl>
                        <GenderRadio field={field} fieldState={fieldState} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}

              {/* Domicile */}
              {isFieldVisible("domicile") && (
                <FormField
                  control={form.control}
                  name="domicile"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>
                        Domicile{" "}
                        {isMandatory("domicile") && (
                          <span className="text-red-500">*</span>
                        )}
                      </FormLabel>
                      <FormControl>
                        <DomicileInput field={field} fieldState={fieldState} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}

              {/* Phone Number */}
              {isFieldVisible("phone_number") && (
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>
                        Phone Number{" "}
                        {isMandatory("phone_number") && (
                          <span className="text-red-500">*</span>
                        )}
                      </FormLabel>
                      <FormControl>
                        <PhoneNumberSelect
                          field={field}
                          fieldState={fieldState}
                          isOpenSelectCountry={isOpenSelectCountry}
                          setIsOpenSelectCountry={setIsOpenSelectCountry}
                          selectedCountry={selectedCountry}
                          setSelectedCountry={setSelectedCountry}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}

              {/* Email */}
              {isFieldVisible("email") && (
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>
                        Email{" "}
                        {isMandatory("email") && (
                          <span className="text-red-500">*</span>
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your email"
                          {...field}
                          error={!!fieldState.error}
                          errorMessage={fieldState.error?.message}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}

              {/* LinkedIn */}
              {isFieldVisible("linkedin_link") && (
                <FormField
                  control={form.control}
                  name="linkedinLink"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>
                        LinkedIn Link{" "}
                        {isMandatory("linkedin_link") && (
                          <span className="text-red-500">*</span>
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://linkedin.com/in/username"
                          {...field}
                          error={!!fieldState.error}
                          errorMessage={fieldState.error?.message}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}

              <div className="sticky bottom-0 left-0 bg-white p-4 border-t border-neutral-200">
                <Button type="submit" className="w-full">
                  Submit Application
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}

      <GestureWebcamModal
        onSubmitImage={(image) => {
          form.setValue("profilePicture", image, { shouldValidate: true });
          setSavedImage(image);
        }}
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
      />
    </>
  );
};

export default JobApplicationForm;
