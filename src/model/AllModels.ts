import mongoose, { Schema, Document, Model } from "mongoose";

// Role Enum
export enum Role {
    SUPER_ADMIN = "SUPER_ADMIN",
    HR = "HR",
    MANAGER = "MANAGER",
    EMPLOYEE = "EMPLOYEE",
}



// LeaveType Enum
export enum LeaveType {
    SICK = "SICK",
    UNPAID = "UNPAID",
    VACATION = "VACATION",
}

// LeaveStatus Enum
export enum LeaveStatus {
    REVIEW = "REVIEW",
    APPROVED = "APPROVED",
    DECLINED = "DECLINED",
}

// User Interface
export interface IUser extends Document {
    email: string;
    password: string;
    username: string;
    role: Role;
    department?: string;
    managerId?: mongoose.Types.ObjectId;
    employees?: IUser[];
    attendance?: IAttendance[];
    leaveRequests?: ILeaveRequest[];
}

// Attendance Interface
export interface IAttendance extends Document {
    userId: mongoose.Types.ObjectId;
    checkIn: Date;
    checkOut?: Date;
}

// LeaveRequest Interface
export interface ILeaveRequest extends Document {
    userId: mongoose.Types.ObjectId;
    type: LeaveType;
    subject: string;
    body: string;
    status: LeaveStatus;
    startDate: Date;
    endDate: Date;
}


// User Schema
const UserSchema: Schema<IUser> = new Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    username: { type: String, required: true },
    role: { type: String, enum: Object.values(Role), default: Role.EMPLOYEE },
    managerId: { type: Schema.Types.ObjectId, ref: "User" },
    employees: [{ type: Schema.Types.ObjectId, ref: "User" }],
    attendance: [{ type: Schema.Types.ObjectId, ref: "Attendance" }],
    leaveRequests: [{ type: Schema.Types.ObjectId, ref: "LeaveRequest" }],
}, { timestamps: true });

// Attendance Schema
const AttendanceSchema: Schema<IAttendance> = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date },
}, { timestamps: true });

// LeaveRequest Schema
const LeaveRequestSchema: Schema<ILeaveRequest> = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: Object.values(LeaveType), required: true },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    status: { type: String, enum: Object.values(LeaveStatus), default: LeaveStatus.REVIEW },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
}, { timestamps: true });


const UserModel = (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>("User", UserSchema);
const AttendanceModel = (mongoose.models.Attendance as Model<IAttendance>) || mongoose.model<IAttendance>("Attendance", AttendanceSchema);
const LeaveRequestModel = (mongoose.models.LeaveRequest as Model<ILeaveRequest>) || mongoose.model<ILeaveRequest>("LeaveRequest", LeaveRequestSchema);

export { UserModel, AttendanceModel, LeaveRequestModel };
