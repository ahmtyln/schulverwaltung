// lib/api.ts
// Schulverwaltung Backend API Client

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// ——— Auth ———
export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  role: string;
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const text = await res.text();
    let message = text || "Login failed";
    try {
      const json = JSON.parse(text) as { message?: string };
      if (json?.message) message = json.message;
    } catch {
      // keep message as text
    }
    throw new Error(message);
  }
  return res.json();
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  name: string;
  surname: string;
}

export async function registerAdmin(data: RegisterRequest): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/admin/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text() || "Registration failed");
}

export async function registerTeacher(data: RegisterRequest): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/teachers/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text() || "Registration failed");
}

export async function registerStudent(data: RegisterRequest): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/students/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text() || "Registration failed");
}

export async function registerParent(data: RegisterRequest): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/parents/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text() || "Registration failed");
}

// Backend Teacher Entity (JSON response)
export interface BackendTeacher {
  teacherId: number;
  name: string;
  surname: string;
  address: string;
  phone: string;
  image: string | null;
  bloodType: string;
  sex: "MALE" | "FEMALE";
  createdAt: string;
  subjects: { id: number; name: string }[];
  lessons: { id: number; name: string }[];
  aclasses: { id: number; name: string }[];
  user: {
    id: number;
    username: string;
    email?: string;
  };
}

// Frontend TeacherListPage Table
export interface Teacher {
  id: number;
  teacherId: string;
  name: string;
  email?: string;
  photo: string;
  phone: string;
  subjects: string[];
  classes: string[];
  address: string;
  bloodType: string;
  createdAt: string;
  lessonIds?: number[];
}

// Teacher Create/Update – matches backend AddTeacherRequestDto / UpdateTeacherRequestDto
export interface CreateTeacher {
  name: string;
  surname: string;
  phone: string;
  address?: string;
  bloodType?: string;
  email: string;
  password?: string;
  lessonIds?: number[];
}

export interface Student {
  id: number;
  studentId?: string;
  fullName?: string;
  name?: string;
  surname?: string;
  email?: string;
  photo?: string;
  phone?: string;
  grade?: number;
  class?: string;
  className?: string;
  address?: string;
  sex?: string; // MALE, FEMALE for dashboard
}

export interface StudentDetail {
  id: number;
  fullName: string;
  studentId?: string;
  email: string;
  phone?: string;
  address?: string;
  className?: string;
  gradeLevel?: number;
  bloodType?: string;
  sex?: string;
  photo?: string;
}

export interface AddStudentRequestDto {
  name: string;
  surname: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  bloodType?: string;
  className?: string;
  gradeLevel?: number;
  parentId?: number;
}


// API Function
export async function fetchTeachers(): Promise<Teacher[]> {
  const res = await fetch(`${BASE_URL}/api/teachers`, {
    cache: "no-store", // frishe data immer
  });

  if (!res.ok) {
    console.error("Teachers fetch error:", res.status, await res.text());
    return []; // leer list
  }

  const backendTeachers: BackendTeacher[] = await res.json();

  return backendTeachers.map((t) => ({
    id: t.teacherId,
    teacherId: `T${String(t.teacherId).padStart(3, '0')}`,
    name: `${t.name} ${t.surname || ''}`.trim(),
    email: t.user?.email,
    photo: t.image || "/noAvatar.png",
    phone: t.phone,
    subjects: (t.subjects || []).map((s: { id: number; name: string }) => s.name),
    classes: (t.aclasses || []).map((c: { id: number; name: string }) => c.name),
    address: t.address || "",
    bloodType: t.bloodType,
    createdAt: t.createdAt,
    lessonIds: (t.lessons || []).map((l: { lessonId?: number; id?: number }) => l.lessonId ?? l.id ?? 0).filter(Boolean),
  }));
}

export async function fetchTeacherById(id: number): Promise<Teacher> {
  const res = await fetch(`${BASE_URL}/api/teachers/${id}`);
  if (!res.ok) throw new Error("Teacher not found");
  const teacher: BackendTeacher = await res.json();

  return {
    id: teacher.teacherId,
    teacherId: `T${String(teacher.teacherId).padStart(3, '0')}`,
    name: `${teacher.name} ${teacher.surname}`,
    email: teacher.user?.email,
    photo: teacher.image || "/noAvatar.png",
    phone: teacher.phone,
    subjects: (teacher.subjects || []).map((s: any) => s.name),
    classes: (teacher.aclasses || []).map((c: any) => c.name),
    address: teacher.address || "",
    bloodType: teacher.bloodType,
    createdAt: teacher.createdAt,
    lessonIds: (teacher.lessons || []).map((l: any) => l.lessonId ?? l.id).filter(Boolean),
  };
}


export async function createTeacher(teacherData: CreateTeacher): Promise<BackendTeacher> {
  const res = await fetch(`${BASE_URL}/api/teachers`, {
    method: "POST",
    headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(teacherData),
  });

  console.log("⬅️ Response status:", res.status);
  const text = await res.text();
  console.log("⬅️ Raw response body:", text);

  if (!res.ok) {
    throw new Error(`Create teacher failed: ${res.status} ${text}`);
  }

  return JSON.parse(text);
}


export async function updateTeacher(id: number, teacherData: Partial<CreateTeacher>): Promise<BackendTeacher> {
  const res = await fetch(`${BASE_URL}/api/teachers/${id}`, {
    method: "PUT",
    headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(teacherData),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Update teacher failed: ${res.status} ${error}`);
  }

  return res.json();
}

export async function deleteTeacher(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/teachers/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Delete teacher failed: ${res.status} ${error}`);
  }
}

export async function fetchTeacherSchedule(id: number) {
  const res = await fetch(`${BASE_URL}/api/teachers/${id}/schedule`);
  if (!res.ok) throw new Error('Failed to load schedule');
  return res.json();
}



// ✅ EXISTING: fetchStudents
export async function fetchStudents(params?: { teacherId?: number }): Promise<Student[]> {
  const url = params?.teacherId != null
    ? `${BASE_URL}/api/students?teacherId=${params.teacherId}`
    : `${BASE_URL}/api/students`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch students');
  return res.json();
}

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  ...(typeof window !== 'undefined' && localStorage.getItem('token') && {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  })
});

// ✅ YENİ: createStudent
export async function createStudent(studentData: AddStudentRequestDto): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/students`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(studentData),
  });
  if (!res.ok) throw new Error('Failed to create student');
}

export async function deleteStudent(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/students/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(await res.text().catch(() => 'Failed to delete student') || 'Failed to delete student');
}

// ✅ Update (gelecek)
export async function updateStudent(id: number, studentData: AddStudentRequestDto): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/students/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(studentData),
  });
  if (!res.ok) throw new Error('Failed to update student');
}

export async function fetchStudentById(id: number): Promise<StudentDetail> {
  const res = await fetch(`${BASE_URL}/api/students/${id}`);
  if (!res.ok) throw new Error('Student not found');
  const data = await res.json();
  return {
    id: data.id,
    fullName: data.fullName || `${data.name} ${data.surname}`,
    studentId: `S${String(data.id || 0).padStart(3, '0')}`,  // ← Safe generate
    email: data.email || '',
    phone: data.phone || '',
    address: data.address || '',
    className: data.className || '10A',
    gradeLevel: data.gradeLevel || 1,
    bloodType: data.bloodType || '',
    sex: data.sex || '',
    photo: data.photo || '/noAvatar.png'
  };
}

export async function fetchStudentSchedule(id: number): Promise<any[]> {
  const res = await fetch(`${BASE_URL}/api/students/${id}/schedule`);
  if (!res.ok) throw new Error('Failed to load schedule');
  return res.json();
}

// ——— Me (giriş yapan kullanıcı: role + studentId/teacherId/parentId) ———
export interface MeStudentSummary {
  id: number;
  fullName: string;
  classId?: number;
}

export interface MeDto {
  role?: string;
  studentId?: number;
  teacherId?: number;
  parentId?: number;
  adminId?: number;
  studentIds?: number[];
  studentSummaries?: MeStudentSummary[];
  classId?: number;
  /** Teacher: class IDs they teach / supervise */
  classIds?: number[];
}

/** Parent/student listelerde gösterim: öğrenci adı veya "Student #id" */
export function getStudentDisplayName(me: MeDto | null, studentId: number): string {
  const name = me?.studentSummaries?.find((s) => s.id === studentId)?.fullName?.trim();
  return name || `Student #${studentId}`;
}

export async function fetchMe(): Promise<MeDto> {
  const res = await fetch(`${BASE_URL}/api/me`, {
    credentials: 'include',
    headers: getAuthHeaders(),
  });
  if (!res.ok) return {};
  return res.json();
}

// ——— Lessons (form dropdowns) ———
export interface LessonListItem {
  id: number;
  name: string;
  subjectName: string;
  className: string;
  teacherName?: string;
  day?: string;
  startTime?: string;
  endTime?: string;
  subjectId?: number;
  classId?: number;
  teacherId?: number;
}

export interface CreateLessonRequest {
  name: string;
  day: string;
  startTime: string;
  endTime: string;
  subjectId: number;
  classId: number;
  teacherId: number;
}

export interface UpdateLessonRequest {
  id: number;
  name?: string;
  day?: string;
  startTime?: string;
  endTime?: string;
  subjectId?: number;
  classId?: number;
  teacherId?: number;
}

export async function fetchLessons(params?: { teacherId?: number }): Promise<LessonListItem[]> {
  const url = params?.teacherId != null
    ? `${BASE_URL}/api/lessons?teacherId=${params.teacherId}`
    : `${BASE_URL}/api/lessons`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load lessons');
  return res.json();
}

export async function createLesson(data: CreateLessonRequest): Promise<void> {
  const payload = { ...data, startTime: data.startTime?.replace('Z', ''), endTime: data.endTime?.replace('Z', '') };
  const res = await fetch(`${BASE_URL}/api/lessons`, {
    method: 'POST',
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text() || 'Failed to create lesson');
}

export async function updateLesson(id: number, data: UpdateLessonRequest): Promise<void> {
  const payload = { ...data, id };
  if (payload.startTime) payload.startTime = payload.startTime.replace('Z', '');
  if (payload.endTime) payload.endTime = payload.endTime.replace('Z', '');
  const res = await fetch(`${BASE_URL}/api/lessons/${id}`, {
    method: 'PUT',
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text() || 'Failed to update lesson');
}

export async function deleteLesson(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/lessons/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(await res.text() || 'Failed to delete lesson');
}

// ——— Events ———
export interface EventListItem {
  id: number;
  title: string;
  className: string;
  classId?: number;
  date: string;
  description?: string;
  price?: number | null;
}

export interface CreateEventRequest {
  title: string;
  description?: string;
  date: string; // ISO datetime e.g. "2025-03-01T14:00:00"
  classId: number;
  price?: number | null;
}

export interface UpdateEventRequest {
  id: number;
  title?: string;
  description?: string;
  date?: string;
  classId?: number;
  price?: number | null;
}

export async function fetchEvents(params?: { studentId?: number; classId?: number; teacherId?: number }): Promise<EventListItem[]> {
  const sp = new URLSearchParams();
  if (params?.studentId != null) sp.set('studentId', String(params.studentId));
  if (params?.teacherId != null) sp.set('teacherId', String(params.teacherId));
  if (params?.classId != null) sp.set('classId', String(params.classId));
  const q = sp.toString();
  const url = q ? `${BASE_URL}/api/events?${q}` : `${BASE_URL}/api/events`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load events');
  return res.json();
}

export async function createEvent(data: CreateEventRequest): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/events`, {
    method: 'POST',
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, date: data.date.replace('Z', '') }),
  });
  if (!res.ok) throw new Error(await res.text() || 'Failed to create event');
}

export async function updateEvent(id: number, data: UpdateEventRequest): Promise<void> {
  const payload = { ...data, id };
  if (payload.date) payload.date = payload.date.replace('Z', '');
  const res = await fetch(`${BASE_URL}/api/events/${id}`, {
    method: 'PUT',
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text() || 'Failed to update event');
}

export async function deleteEvent(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/events/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(await res.text() || 'Failed to delete event');
}

// ——— Announcements ———
export interface AnnouncementListItem {
  id: number;
  title: string;
  className: string;
  classId?: number;
  date: string;
  description?: string;
}

// ——— Messages ———
export interface MessageListItem {
  id: number;
  text: string;
  createdAt: string;
  senderName: string;
  receiverName: string;
  studentId?: number;
  studentName?: string;
}

export async function sendMessageToParent(payload: { studentId: number; text: string }): Promise<MessageListItem> {
  const res = await fetch(`${BASE_URL}/api/messages/teacher-to-parent`, {
    method: 'POST',
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text() || 'Failed to send message');
  return res.json();
}

export async function fetchParentMessages(): Promise<MessageListItem[]> {
  const res = await fetch(`${BASE_URL}/api/messages/parent`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(await res.text() || 'Failed to load messages');
  return res.json();
}

export async function fetchTeacherMessages(): Promise<MessageListItem[]> {
  const res = await fetch(`${BASE_URL}/api/messages/teacher`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(await res.text() || 'Failed to load messages');
  return res.json();
}

export async function sendMessageToTeacher(payload: { studentId: number; text: string }): Promise<MessageListItem> {
  const res = await fetch(`${BASE_URL}/api/messages/parent-to-teacher`, {
    method: 'POST',
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text() || 'Failed to send message');
  return res.json();
}

export async function deleteMessage(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/messages/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(await res.text() || 'Failed to delete message');
}

export interface CreateAnnouncementRequest {
  title: string;
  description?: string;
  date: string;
  classId: number;
}

export interface UpdateAnnouncementRequest {
  id: number;
  title?: string;
  description?: string;
  date?: string;
  classId?: number;
}

export async function fetchAnnouncements(params?: { studentId?: number; classId?: number; teacherId?: number }): Promise<AnnouncementListItem[]> {
  const sp = new URLSearchParams();
  if (params?.studentId != null) sp.set('studentId', String(params.studentId));
  if (params?.teacherId != null) sp.set('teacherId', String(params.teacherId));
  if (params?.classId != null) sp.set('classId', String(params.classId));
  const q = sp.toString();
  const url = q ? `${BASE_URL}/api/announcements?${q}` : `${BASE_URL}/api/announcements`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load announcements');
  return res.json();
}

export async function createAnnouncement(data: CreateAnnouncementRequest): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/announcements`, {
    method: 'POST',
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, date: data.date.replace('Z', '') }),
  });
  if (!res.ok) throw new Error(await res.text() || 'Failed to create announcement');
}

export async function updateAnnouncement(id: number, data: UpdateAnnouncementRequest): Promise<void> {
  const payload = { ...data, id };
  if (payload.date) payload.date = payload.date.replace('Z', '');
  const res = await fetch(`${BASE_URL}/api/announcements/${id}`, {
    method: 'PUT',
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text() || 'Failed to update announcement');
}

export async function deleteAnnouncement(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/announcements/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(await res.text() || 'Failed to delete announcement');
}

// ——— Attendance ———
export interface AttendanceListItem {
  id: number;
  studentId?: number;
  date: string;
  present: boolean;
  studentName: string;
  lessonName: string;
}

export interface AddAttendanceRequest {
  date: string; // ISO datetime
  lessonId: number;
  studentIds: number[];
}

export async function fetchAttendances(params?: { studentId?: number; teacherId?: number }): Promise<AttendanceListItem[]> {
  const sp = new URLSearchParams();
  if (params?.studentId != null) sp.set('studentId', String(params.studentId));
  if (params?.teacherId != null) sp.set('teacherId', String(params.teacherId));
  const q = sp.toString();
  const url = q ? `${BASE_URL}/api/attendance?${q}` : `${BASE_URL}/api/attendance`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load attendance');
  return res.json();
}

export async function createAbsentAttendance(request: AddAttendanceRequest): Promise<AttendanceListItem[]> {
  const res = await fetch(`${BASE_URL}/api/attendance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(request),
  });
  if (!res.ok) throw new Error(await res.text() || 'Failed to add absent');
  return res.json();
}

// ——— Parents (list for ADMIN/TEACHER) ———
export interface ParentListItem {
  id: number;
  name: string;
  surname: string;
  email?: string;
  phone?: string;
  address?: string;
  studentNames?: string[];
  studentIds?: number[];
}

export interface CreateParentRequest {
  name: string;
  surname: string;
  email: string;
  password: string;
  phone: string;
  address?: string;
  studentIds?: number[];
}

export interface UpdateParentRequest {
  id: number;
  name?: string;
  surname?: string;
  phone?: string;
  address?: string;
  studentIds?: number[];
}

export async function fetchParents(params?: { teacherId?: number }): Promise<ParentListItem[]> {
  const url = params?.teacherId != null
    ? `${BASE_URL}/api/parents?teacherId=${params.teacherId}`
    : `${BASE_URL}/api/parents`;
  const res = await fetch(url, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to load parents');
  return res.json();
}

export async function createParent(data: CreateParentRequest): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/admin/parents`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text() || 'Failed to create parent');
}

export async function updateParent(id: number, data: UpdateParentRequest): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/admin/parents/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ ...data, id }),
  });
  if (!res.ok) throw new Error(await res.text() || 'Failed to update parent');
}

export async function deleteParent(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/admin/parents/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(await res.text() || 'Failed to delete parent');
}

// ——— Subjects ———
export interface SubjectListItem {
  id: number;
  name: string;
  teacherName?: string;
  teacherId?: number | null;
}

export async function fetchSubjects(): Promise<SubjectListItem[]> {
  const res = await fetch(`${BASE_URL}/api/subjects`);
  if (!res.ok) throw new Error('Failed to load subjects');
  return res.json();
}

export async function createSubject(data: { name: string; teacherId?: number | null }): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/subjects`, {
    method: 'POST',
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: data.name.trim(), teacherId: data.teacherId || null }),
  });
  if (!res.ok) throw new Error(await res.text() || 'Failed to create subject');
}

export async function updateSubject(id: number, data: { name?: string; teacherId?: number | null }): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/subjects/${id}`, {
    method: 'PUT',
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text() || 'Failed to update subject');
}

export async function deleteSubject(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/subjects/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(await res.text() || 'Failed to delete subject');
}

// ——— Grades ———
export interface GradeListItem {
  id: number;
  level: number;
}

export async function fetchGrades(): Promise<GradeListItem[]> {
  const res = await fetch(`${BASE_URL}/api/grades`);
  if (!res.ok) throw new Error('Failed to load grades');
  return res.json();
}

// ——— Classes ———
export interface ClassListItem {
  id: number;
  classId?: number; // some endpoints may return classId instead of id
  name: string;
  capacity?: number;
  gradeLevel?: number;
  supervisorName?: string;
  gradeId?: number | null;
  teacherId?: number | null;
}

export async function fetchClasses(params?: { teacherId?: number }): Promise<ClassListItem[]> {
  const url = params?.teacherId != null
    ? `${BASE_URL}/api/classes?teacherId=${params.teacherId}`
    : `${BASE_URL}/api/classes`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load classes');
  return res.json();
}

export async function createClass(data: { name?: string; capacity?: number; gradeId: number; teacherId?: number | null }): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/classes`, {
    method: 'POST',
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text() || 'Failed to create class');
}

export async function updateClass(id: number, data: { name?: string; capacity?: number; gradeId?: number | null; teacherId?: number | null }): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/classes/${id}`, {
    method: 'PUT',
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text() || 'Failed to update class');
}

export async function deleteClass(id: number): Promise<void> {
  if (id == null || id === undefined || Number.isNaN(Number(id))) {
    throw new Error('Invalid class id');
  }
  const res = await fetch(`${BASE_URL}/api/classes/${Number(id)}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(await res.text() || 'Failed to delete class');
}

// ——— Exams (sınav + not modülü) ———
export interface ExamListItem {
  id: number;
  title?: string;
  subjectName: string;
  className: string;
  teacherName: string;
  startTime: string;
  endTime?: string;
  lessonId?: number;
}

export async function fetchExams(params?: { classId?: number; studentId?: number; teacherId?: number }): Promise<ExamListItem[]> {
  const sp = new URLSearchParams();
  if (params?.studentId != null) sp.set('studentId', String(params.studentId));
  if (params?.teacherId != null) sp.set('teacherId', String(params.teacherId));
  if (params?.classId != null) sp.set('classId', String(params.classId));
  const q = sp.toString();
  const url = q ? `${BASE_URL}/api/exams?${q}` : `${BASE_URL}/api/exams`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load exams');
  const list = await res.json();
  return list.map((e: ExamListItem) => ({
    ...e,
    date: e.startTime ? e.startTime.slice(0, 10) : '',
  }));
}

export async function createExam(data: { title: string; startTime: string; endTime: string; lessonId: number }): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/exams`, {
    method: 'POST',
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text() || 'Failed to create exam');
}

export async function updateExam(id: number, data: { title: string; startTime: string; endTime: string; lessonId: number }): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/exams/${id}`, {
    method: 'PUT',
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text() || 'Failed to update exam');
}

export async function deleteExam(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/exams/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(await res.text() || 'Failed to delete exam');
}

// ——— Assignments ———
export interface AssignmentListItem {
  id: number;
  title?: string;
  subjectName: string;
  className: string;
  teacherName: string;
  startTime?: string;
  endTime: string;
  lessonId?: number;
}

export async function fetchAssignments(params?: { studentId?: number; teacherId?: number }): Promise<AssignmentListItem[]> {
  const sp = new URLSearchParams();
  if (params?.studentId != null) sp.set('studentId', String(params.studentId));
  if (params?.teacherId != null) sp.set('teacherId', String(params.teacherId));
  const q = sp.toString();
  const url = q ? `${BASE_URL}/api/assignments?${q}` : `${BASE_URL}/api/assignments`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load assignments');
  return res.json();
}

export async function createAssignment(data: { title: string; startTime: string; endTime: string; lessonId: number }): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/assignments`, {
    method: 'POST',
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text() || 'Failed to create assignment');
}

export async function updateAssignment(id: number, data: { title: string; startTime: string; endTime: string; lessonId: number }): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/assignments/${id}`, {
    method: 'PUT',
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text() || 'Failed to update assignment');
}

export async function deleteAssignment(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/assignments/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(await res.text() || 'Failed to delete assignment');
}

// ——— Results (notlar) ———
export interface ResultListItem {
  id: number;
  title: string;
  subjectName: string;
  className: string;
  studentName: string;
  teacherName: string;
  score: number;
  date: string | null;
  type: string;
  studentId?: number | null;
  examId?: number | null;
  assignmentId?: number | null;
}

export async function fetchResults(params?: { studentId?: number; teacherId?: number }): Promise<ResultListItem[]> {
  const sp = new URLSearchParams();
  if (params?.studentId != null) sp.set('studentId', String(params.studentId));
  if (params?.teacherId != null) sp.set('teacherId', String(params.teacherId));
  const q = sp.toString();
  const url = q ? `${BASE_URL}/api/results?${q}` : `${BASE_URL}/api/results`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load results');
  const list = await res.json();
  return list.map((r: ResultListItem & { date?: string }) => ({
    ...r,
    date: r.date ? (typeof r.date === 'string' ? r.date.slice(0, 10) : '') : '',
  }));
}

export async function createResult(data: { score: number; studentId: number; examId?: number; assignmentId?: number }): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/results`, {
    method: 'POST',
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create result');
}

export async function updateResult(id: number, data: { score: number }): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/results/${id}`, {
    method: 'PUT',
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update result');
}

export async function deleteResult(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/results/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to delete result');
}
