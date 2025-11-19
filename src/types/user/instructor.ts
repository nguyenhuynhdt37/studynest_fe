export interface InstructorResponse {
  id: string;
  fullname: string;
  avatar: string | null;
  conscious: string | null;
  district: string | null;
  citizenship_identity: string | null;
  instructor_description: string | null; // HTML
  facebook_url: string | null;
  student_count: number;
  rating_avg: number;
  evaluated_count: number;
  course_count: number;
}

export interface InstructorError {
  message: string;
  status?: number;
}
