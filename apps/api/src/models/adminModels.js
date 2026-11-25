import mongoose from "mongoose";

// User explicitly requested: "don't hash the password for users and admin both"
const adminUserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["superadmin", "manager"], default: "superadmin" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

adminUserSchema.methods.toSafeJSON = function toSafeJSON() {
  return {
    id: String(this._id),
    name: this.name,
    email: this.email,
    role: this.role,
    isActive: this.isActive,
    createdAt: this.createdAt?.toISOString?.() || new Date().toISOString(),
  };
};

const auditLogSchema = new mongoose.Schema(
  {
    adminId: { type: String, required: true },
    adminEmail: { type: String, required: true },
    action: { type: String, required: true },
    entityType: { type: String, required: true },
    entityId: { type: String, default: "" },
    summary: { type: String, required: true },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export function createAdminModels(adminConn) {
  return {
    AdminUser:
      adminConn.models.AdminUser ||
      adminConn.model("AdminUser", adminUserSchema, "admins"),
    AuditLog:
      adminConn.models.AuditLog ||
      adminConn.model("AuditLog", auditLogSchema, "audit_logs"),
  };
}
