export const hospitalDoctors = [
  { id: "d1", name: "Dr. Kavita Shah", specialty: "Cardiology", experience: "14 years", schedule: "Mon–Fri · 10:00–16:00", patients: 32, status: "Available" },
  { id: "d2", name: "Dr. Rohan Mehta", specialty: "Orthopedics", experience: "11 years", schedule: "Mon, Wed, Fri · 09:00–14:00", patients: 24, status: "In surgery" },
  { id: "d3", name: "Dr. Nisha Iyer", specialty: "Pediatrics", experience: "9 years", schedule: "Tue–Sat · 11:00–17:00", patients: 18, status: "Available" },
  { id: "d4", name: "Dr. Arjun Rao", specialty: "General Medicine", experience: "17 years", schedule: "Mon–Sat · 08:00–13:00", patients: 41, status: "Available" },
];

export const hospitalPatients = [
  { id: "IP-2841", name: "Suresh Menon", age: 62, department: "Cardiology", room: "A-12", lastVisit: "Today, 09:20", status: "Admitted" },
  { id: "OP-7190", name: "Meena Joshi", age: 38, department: "General Medicine", room: "OPD 04", lastVisit: "Today, 10:05", status: "Waiting" },
  { id: "IP-2838", name: "Ravi Kulkarni", age: 47, department: "Orthopedics", room: "B-08", lastVisit: "Yesterday", status: "Admitted" },
  { id: "OP-7183", name: "Asha Verma", age: 29, department: "Pediatrics", room: "OPD 02", lastVisit: "Yesterday", status: "Discharged" },
  { id: "IP-2832", name: "Fatima Sheikh", age: 71, department: "Neurology", room: "C-03", lastVisit: "08 Sep 2026", status: "Admitted" },
];

export const hospitalAppointments = [
  { time: "09:00", patient: "Meena Joshi", doctor: "Dr. Arjun Rao", department: "General Medicine", status: "Checked in" },
  { time: "09:30", patient: "Suresh Menon", doctor: "Dr. Kavita Shah", department: "Cardiology", status: "In consultation" },
  { time: "10:15", patient: "Asha Verma", doctor: "Dr. Nisha Iyer", department: "Pediatrics", status: "Confirmed" },
  { time: "11:00", patient: "Ravi Kulkarni", doctor: "Dr. Rohan Mehta", department: "Orthopedics", status: "Confirmed" },
  { time: "11:30", patient: "Fatima Sheikh", doctor: "Dr. Kavita Shah", department: "Cardiology", status: "Waiting" },
];

export const hospitalStaff = [
  { name: "Anita Thomas", role: "Nurse in-charge", department: "Cardiology", schedule: "07:00–15:00", status: "Active" },
  { name: "Vikram Singh", role: "Receptionist", department: "Front desk", schedule: "08:00–16:00", status: "Active" },
  { name: "Priya Nair", role: "Lab technician", department: "Laboratory", schedule: "09:00–17:00", status: "Active" },
  { name: "Mohan Patil", role: "Ward assistant", department: "Inpatient care", schedule: "15:00–23:00", status: "On leave" },
];

export const hospitalDepartments = [
  { name: "Cardiology", doctors: 12, beds: "24 / 28", occupancy: 86, color: "bg-rose-500" },
  { name: "General Medicine", doctors: 18, beds: "31 / 40", occupancy: 78, color: "bg-primary" },
  { name: "Orthopedics", doctors: 8, beds: "18 / 24", occupancy: 75, color: "bg-amber-500" },
  { name: "Pediatrics", doctors: 8, beds: "12 / 18", occupancy: 67, color: "bg-emerald-500" },
];