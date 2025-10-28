export interface JobApplication {
  id?: string;
  jobId: string;
  fullName?: string;
  dateOfBirth?: Date;
  gender?: string;
  domicile?: string;
  phoneNumber?: string;
  email?: string;
  linkedin?: string;
  profilePicture?: string;
  createdAt: string;
  [key: string]: any;
}
